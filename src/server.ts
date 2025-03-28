import * as dotenv from 'dotenv'
dotenv.config()
import {Secret} from "jsonwebtoken"
import mongoose from "mongoose"
import express from "express"
import expressSession from "express-session"
import cors from "cors"
import bcrypt from 'bcryptjs'
import passport from 'passport'
import * as passportLocal from 'passport-local'



let appMode = ''
if (process.argv.includes("--dev"))
    appMode = "dev"
else appMode = "prod"

//set port
const PORT = process.env.PORT || 8080


//use express & express json util
const app = express()
app.use(express.json())


//determine the cors origin via build mode (either dev or production)
let corsOriginOption = ''

if (appMode === "dev"){
    console.log("dev mode detected.\nUpdating cors origin")
    corsOriginOption = process.env.CORS_ORIGIN_DEVELOPMENT
}
else{
    console.log("starting server in production mode")
    corsOriginOption = process.env.CORS_ORIGIN_PRODUCTION
}

const corsOrigin = corsOriginOption
const corsOptions = {
    origin: corsOrigin,
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(corsOptions))


//setup session options
const sessionOptions = {
    secret: process.env.SESSION_SECRET || "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        httpOnly: true,
        //sameSite: `${appMode === "prod" ? "none" : "lax"}`, // cross site // set lax while working with http:localhost, but none when in prod
        secure: appMode === "prod" ? true : "auto", // only https // auto when in development, true when in prod
        maxAge: 60000 * 60 //1hr
    }
}
//@ts-ignore
app.use(expressSession(sessionOptions))
app.use(passport.session())


//setup database connection & define schemas & models
const dbEntryCollectionName:string = 'journalEntries'
const uri = process.env.DATABASE_URI as Secret

mongoose.set('strictQuery',false)
mongoose.connect(uri.toString(),{dbName:"expJournalApp"})
const entrySchema = new mongoose.Schema({
    title: String,
    content: String,
    categories: [String],
    keywords: [String],
    dateMMDDYYYY: String
}, {collection: `${dbEntryCollectionName}`})
const journalEntry = mongoose.model('journalEntry',entrySchema)

const adminSchema = new mongoose.Schema({
    username: {type: String},
    password: {type: String}
}, {collection: "admins"})
const Admin = mongoose.model('admin',adminSchema)




//password hashing/comparing utilities
async function hashPassword(password:string){
    const hashedPassword = await bcrypt.hash(password,10) 
    return hashedPassword
}

async function comparePassword(password:string, hash:string){
    const doesPasswordMatch = await bcrypt.compare(password, hash)
    return doesPasswordMatch
}

async function findMatches(username:string, password:string){
    for await (const user of Admin.find({username:username})){
        if (await comparePassword(password, user.password)){
            return user
        }
    }
    return null
}



//setup authentication middleware
//-- local strategy
const LocalStrategy = passportLocal.Strategy
passport.use(new LocalStrategy(
    
    (username:string, password:string, done:any)=>{

        //check if the username exists
        Admin.countDocuments({username}).exec()
        .then((result) =>{
            if (result > 0){
                //Username exists. Check if the provided password belongs to any of the matching usernames
                findMatches(username,password)
                .then(result =>{
                    if (result != null){
                        console.log("Authentication Success")
                        return done(null, result)
                    }
                    else
                    {
                        console.log("Authentication Failed. User password incorrect")
                        return done(null,false)
                    }
                })
                .catch(err =>{
                    console.log("Authentication Aborted. An error occured during user lookup:\n",err)
                    return done(err)
                })
                
            }
            else{
                console.log("Authentication Failed. User not found")
                return done(null,false)
            }
        })
        .catch(err =>{
            console.log("Authentication Aborted. An error occured during user lookup:\n",err)
            return done(err)
        })
    }
))

//-- writing/reading tokens
passport.serializeUser(function(user,done) {
    console.log("Serializing user:",user)

    //@ts-ignore
    done(null,user._id)
})

passport.deserializeUser(async function(id:any, done) {
    console.log("deserializing user based on id:",id)
    try{
        const user = await Admin.findById(id).exec()
        if (user === null){
            //return a false user to passport if no user was found
            done(null,false)
        } 
            
        else{
            console.log("Found User in deserialize:",user)
            //provide passport with the matching user
            done(null, user)
        }
            
    }

    catch(err){
        done(err)
    }
    
})



//route: create new Admin (unused)
app.post("/create-admin", (req,res) =>{
    if (appMode === "prod"){
        res.status(401)
        res.send("Forbidden Route Reached. Admin may only be created in Devmode")
    }
    try {
        console.log("request body data:\n",req.body)
        const hashedPassword = hashPassword(req.body.password)
        .then((result)=>{
            console.log("result:\n",result)
            console.log("hashed Passwrd:\n",hashedPassword)

            const newAdmin = new Admin({
                username: req.body.username,
                password: result
        
            })
            console.log("created Admin:\n",newAdmin)
        
            newAdmin.save() //thenable, but not a promise ;)
            .then( ()=>{
                console.log(`Saving new Admin: 
                    \nusername: ${newAdmin.username} 
                    \npassword: ${req.body.password} 
                    \nhashed password: ${newAdmin.password}`)
                
                res.status(201)
                res.send(`New admin added: ${newAdmin.username}`)
            })
        })
        .catch(err =>{
            console.log("Error encountered during hash:\n",err)
            res.status(500)
            res.send(`error detected: ${err}`)
        })
    }
    catch(err){
        console.log("Error encountered:\n",err)
        res.status(500)
        res.send(`error detected: ${err}`)
    }
})


//route: login
app.post("/login", passport.authenticate('local'), (req,res) =>{

    
    req.logIn(req.user, (possibleLoginError:any)=>{
        if (possibleLoginError){
            console.log(possibleLoginError)
            res.status(500)
            res.send("Error occured with login")
        }
        else{
            //@ts-ignore
            console.log(`Login successful for ${req.user.username}` )
            
            res.status(200)
            //@ts-ignore
            res.send(req.user.username)
        }
            
    })
    
    
})

//route: logout
app.post("/logout", (req,res) =>{
    console.log("Logout Visited:")
    console.log("User:",req.user)

    if (req.user){
        //@ts-ignore
        const username = req.user.Username

        req.logOut((possibleErr)=>{
            if (possibleErr){
                console.log("Error while attempting LOGOUT:\n",possibleErr)
                res.status(500)
                res.send("Error while attempting Logout")
            }
            else{
                //@ts-ignore
                console.log("User Logged Out")
                res.status(200)
                res.send('Log out Successful')
            }
        })
    }

    else{
        res.status(200)
        res.send("Respecting Log out (no user currently logged in)")
    }
    
    
    
})


//route: visit server
app.get('/' ,(request,response)=>{
    response.send('<h1>HelloWorld</h1>')
})

//route: get all entries in collection
app.get(`/${dbEntryCollectionName}`, (request, response)=>{
    console.log("Get Collection Visited:")
    console.log("user:",request.user)

    journalEntry.find({}).then( result =>{
        const entryCollection = result

        response.json(entryCollection)
        response.status(200)
    })
    .catch((error) =>{
        response.send(`error processing request: ${error}`).status(500)
    })
})

//route: get a specific entry
app.get(`/${dbEntryCollectionName}/:id`, (request, response)=>{

    const id = request.params.id
    console.log("requested id -> ",id)


    journalEntry.find({_id: id}).then( result =>{
        const entryCollection = result

        if (entryCollection.length < 1)
        {
            response.status(400)
            response.send("id doesn't exist in db")
        }
        else{
            response.json(entryCollection)
            response.status(200)
        }
        
    })
    .catch((error)=>{
        console.log("an error occured:",error)
        console.log("============== Server still running! ==============")
        response.status(500)
        response.end()
    }
        
    )
})


//entry operation utilities
async function updateEntry(entry:any){
    //console.log(`Attempting to update entry with id '${entry._id}' in db...`)
    //console.log("provided entry:",entry)
    const updatedEntry = await journalEntry.findByIdAndUpdate(entry._id, {
        title: entry.title,
        content: entry.content,
        dateMMDDYYYY: entry.dateMMDDYYYY,
        categories: entry.categories,
        keywords: entry.keywords 
    }, {new:true})
    //console.log("updated Entry:",updatedEntry)
    return updatedEntry
    
}

async function saveEntry(entry:any){
    const newEntry = await journalEntry.create({
        title: entry.title,
        content: entry.content,
        dateMMDDYYYY: entry.dateMMDDYYYY,
        categories: entry.categories,
        keywords: entry.keywords
    })
    console.log("new Entry created:",newEntry)
    return newEntry
}

async function deleteEntry(id:string){
    console.log("id to remove from db:",id)
    const deletededEntry = await journalEntry.findByIdAndDelete(id)
    console.log("deleted Entry:",deletededEntry)
    return deletededEntry
}

//route: update entry
app.put(`/${dbEntryCollectionName}/:entry`, (req,res)=>{
    console.log("Update Visited:")
    console.log("user:",req.user)

    if (req.user){
        const fullEntry = req.body

        try {
            updateEntry(fullEntry)
            res.status(200)
            res.send(`update successful`)

            
        } catch (error) {
            console.log("an error occured while attempting to update the entry within the db:",error)
            console.log("============== Server still running! ============")
            res.status(500)
            res.send(`an error occured while communicating with the db: ${error}`)
        }
    }
    else
    {
        res.status(401)
        res.send("Only admins may edit entries")
    }
})

//route: add entry
app.post(`/${dbEntryCollectionName}`, (req,res)=>{
    console.log("Post Visited:")
    console.log("user:",req.user)

    if (req.user){
        const providedEntry = req.body
        try{
            const savedEntry = saveEntry(providedEntry)
            res.json(savedEntry).status(200)
        }
        catch(error){ 
            console.log("an error occured while attempting to create the entry within the db:",error)
            console.log("============== Server still running! ============")
            res.send(`an error occured while communicating with the db: ${error}`).status(500)
        }
    }
    else
    {
        res.status(401)
        res.send("Only admins may create entries")
    }
    
    
})

//route: remove entry
app.delete(`/${dbEntryCollectionName}/:id`, (req,res)=>{
    console.log("Delete Visited:")
    console.log("user:",req.user)
    if (req.user){
        const id = req.params.id
        try {
            const deletedEntry = deleteEntry(id)
            if (deletedEntry === null)
            {
                res.send(`couldn't find entry with id '${id}'`).status(404)
            } 
            else{
                res.json(deletedEntry).status(200)
            }
        } catch (error) {
            console.log("an error occured while attempting to delete an entry within the db:",error)
            console.log("============== Server still running! ============")
            res.send(`an error occured while communicating with the db: ${error}`).status(500)
        }
    }
    else{
        res.status(401)
        res.send("Only admins may delete entries")
    }


    
})

//route(DEBUG): returns a specified response, depending on the reqested status code
app.get(`/debug_status_codes/:desiredCode`,(req,res)=>{
    console.log(`DEBUG ADDRESS VISITED. REQUESTED CODE: '${req.params.desiredCode}'`)

    let status = Number.NaN
    try{
        status = Number(req.params.desiredCode)
    }
    catch(error){
        console.log(`error while converting '${req.params.desiredCode}' to a number. statusCode defaulted to 'NaN'`)
    }
     
    
    switch(true){
        case (status >= 100 && status < 200):
            console.log(`Sending requested Status 'INFORMATIONAL'`)
            res.status(100).send("DEBUG STATUS: 'INFORMATIONAL'").end()
            return
        case (status >= 200 && status < 300):
            console.log(`Sending requested Status 'SUCCESSFUL'`)
            res.status(200).send("DEBUG STATUS: 'SUCCESS'")
            return
        case (status >= 300 && status < 400):
            console.log(`Sending requested Status 'REDIRECTION'`)
            res.status(300).send("DEBUG STATUS: 'REDIRECTION'").end()
            return
        case (status >= 400 && status < 500):
            console.log(`Sending requested Status 'CLIENT ERROR'`)
            res.status(400).send("DEBUG STATUS: 'CLIENT ERROR'")
            return
        case (status >= 500 && status < 600):
            console.log(`Sending requested Status 'SERVER ERROR'`)
            res.status(500).send("DEBUG STATUS: 'SERVER ERROR'")
            return
        default:
            console.log(`Case undefined for status code '${status}'. sending -1 as the status`)
            res.status(400).send("DEBUG STATUS: 'CLIENT ERROR DUE TO UNDEFINED CASE'")
            return
    }
})





app.listen(PORT)
console.log(`server running on port ${PORT}`)
