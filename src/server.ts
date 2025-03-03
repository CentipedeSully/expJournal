import * as dotenv from 'dotenv'
dotenv.config()
import {Secret} from "jsonwebtoken"
import mongoose from "mongoose"
import express from "express"
import cors from "cors"


//use express
const app = express()
app.use(express.json())


//determine the cors origin via build mode (either dev or production)
let corsOriginOption = ''

if (process.argv.includes("--dev")){
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
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))


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



//visit server
app.get('/' ,(request,response)=>{
    response.send('<h1>HelloWorld</h1>')
})

//get all entries in collection
app.get(`/${dbEntryCollectionName}`, (request, response)=>{

    journalEntry.find({}).then( result =>{
        const entryCollection = result

        response.json(entryCollection)
        response.status(200)
    })
    .catch((error) =>{
        response.send(`error processing request: ${error}`).status(500)
    })
})

//get a specific entry
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



async function findEntryInDB(entry:any){

    console.log(`Searching db for entry with id '${entry._id}'...`)
    const matchingEntry = await journalEntry.findById(entry._id)
    console.log(`found entry: ${matchingEntry}`)
    return matchingEntry
} 

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

app.put(`/${dbEntryCollectionName}/:entry`, (req,res)=>{
    const fullEntry = req.body

    try {
        updateEntry(fullEntry)
        res.send(`update successful`).status(200)

        
    } catch (error) {
        console.log("an error occured while attempting to update the entry within the db:",error)
        console.log("============== Server still running! ============")
        res.send(`an error occured while communicating with the db: ${error}`).status(500)
    }
})

app.post(`/${dbEntryCollectionName}`,(req,res)=>{
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
    
})

app.delete(`/${dbEntryCollectionName}/:id`, (req,res)=>{
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
})

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




const PORT = process.env.PORT || 8080
app.listen(PORT)
console.log(`server running on port ${PORT}`)
