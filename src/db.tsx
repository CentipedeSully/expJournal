import mongoose from "mongoose"
import express from "express"
import cors from "cors"



const dbEntryCollectionName:string = 'expJournal'
const dbPassword:string=''
const uri = `mongodb+srv://sullivansmith057:${dbPassword}@exp-journal-cluster.9fy8r.mongodb.net/${dbEntryCollectionName}?retryWrites=true&w=majority&appName=exp-journal-cluster`

mongoose.set('strictQuery',false)
mongoose.connect(uri)

const entrySchema = new mongoose.Schema({
    title: String,
    content: String,
    categories: [String],
    keywords: [String],
    dateMMDDYYYY: String
})

const Entry = mongoose.model('Entry',entrySchema)
const corsOptions = {
    origin:`http://localhost:5173`,
    optionsSuccessStatus: 200
}


const app = express()
app.use(cors(corsOptions))

//visit server
app.get('/' ,(request,response)=>{
    response.send('<h1>HelloWorld</h1>')
})

//get all entries in collection
app.get(`/${dbEntryCollectionName}`, (request, response)=>{

    Entry.find().then( result =>{
        const entryCollection = result

        response.json(entryCollection)
        response.status(200)
    })
})







const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)
