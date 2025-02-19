import mongoose from "mongoose"
import { Express } from "express"
import * as http from 'node:http'


const app = http.createServer((request:http.IncomingMessage,response:http.ServerResponse)=>{
    response.writeHead(200, {'Content-Type': 'text/plain'})
    response.end('Hello world')
})

const entryCollection = 'journalEntries'
const password:string=''

//mongoDb connection
const uri = `mongodb+srv://sullivansmith057:${password}@exp-journal-cluster.9fy8r.mongodb.net/${entryCollection}?retryWrites=true&w=majority&appName=exp-journal-cluster`

mongoose.set('strictQuery',false)
//mongoose.connect(uri)
//mongoose.connection.close()

const entrySchema = new mongoose.Schema({
    title: String,
    content: String,
    categories: [String],
    keywords: [String],
    dateMMDDYYYY: String
})

const Entry = mongoose.model('Entry',entrySchema)



const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`)
