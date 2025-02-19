import { useEffect, useState } from "react"
import WelcomeUi from "./WelcomeUi"
import EntriesUi from "./EntriesUi"
import EntryOverlay from "./EntryOverlay"
import { Entry } from "./entry"
import axios from "axios"

const entriesAddress = 'http://localhost:3001/expJournal'

function App() { 

  const getCollectionFromDb = () =>{
    axios.get(entriesAddress).then((response)=>{
      setCollection(response.data)
    })
    
  }

  

  /*
  const putEntryToDb = (entry:Entry) =>{
    axios.put().then( (response) =>{
      getCollectionFromDb()
    }
      
    )
  } */

  /*
  const postEntryToDb = (entry:Entry)=>{
    axios.post().then( (response)=>{
      getCollectionFromDb()
    })
  } */
 

  /*const collection= [
    
    {
      id:'0000',
      title:"hoard",
      content:"hoard all the treasure.",
      categories: ["goals","test entries"],
      keywords:["treasure","hoard"],
      dateMMDDYYYY: "02/16/2025"
    },
    {
      id:'0001',
      title:"Hello World",
      content:"Hello world! This it the first entry! Woo!",
      categories: ["milestones","test entries"],
      keywords:["hello world","first"],
      dateMMDDYYYY: "02/16/2025"
    },
    {
      id:'0002',
      title:"Feb2025 ToDo",
      content:"Chill\nChill\nWork\nChill",
      categories: ["Tasklists","test entries"],
      keywords:["todo"],
      dateMMDDYYYY: "02/16/2025"
    }
  ]*/

  
  const emptyEntry:Entry = {
    _id:'',
    title:"",
    content:"",
    categories: [],
    keywords:[],
    dateMMDDYYYY: ''

  }

  const [currentUi, setUi] = useState("welcome")
  const [entries,setCollection] = useState([])
  const [viewedEntry, setViewedEntry] = useState(emptyEntry)
  const [showEntryWindow,setShowEntryWindow] = useState(false)
  const [editMode,setMode] = useState(false)
  const [ignoreClicks, setIgnoreClicks] = useState(false)

  useEffect(()=>{
    getCollectionFromDb()
  },[])

  const enterEditMode = () =>{
      setMode(true)
  }
  const exitEditMode = () => {
      setMode(false)
  }
    
  const enterViewScreen = () =>{
    setUi("viewCollection")
  }

  const hideEntryModal = () =>{
    setShowEntryWindow(false)
    setIgnoreClicks(false)
  }

  const showEmptyModal = () =>{
    setViewedEntry(emptyEntry)
    setShowEntryWindow(true)
    setIgnoreClicks(true)
  }

  const exitEditModeAndCloseModal = () =>{
    exitEditMode()
    hideEntryModal()
  }

  const saveEntryToApp= (entry:Entry) =>{

    console.log("entry to save: ",entry)
    const matchingEntry = entries.find((item)=> item._id === entry._id)
    console.log("match: ",matchingEntry)
    console.log("match found for save?",matchingEntry !== undefined)
    if (matchingEntry !== undefined){
      const newCollection = entries.map((item)=> item._id === entry._id ? entry : item)
      setCollection(newCollection)
      setViewedEntry(emptyEntry)
    }
    
    else{

      const newEntry:Entry = {
        _id: entries.length.toString(),
        title:entry.title,
        content:entry.content,
        categories: entry.categories,
        keywords: entry.keywords,
        dateMMDDYYYY: entry.dateMMDDYYYY
      }

      const newCollection = entries.concat(newEntry)
      setCollection(newCollection)
      setViewedEntry(emptyEntry)
    }
    

  }

  const viewEntryInModal = (entry:Entry) => {
    setViewedEntry(entry)
    setShowEntryWindow(true)
    setIgnoreClicks(true)
    
  }

  const pointerEventsClass = ignoreClicks ? " pointer-events-none" : " pointer-events-auto"


  switch(currentUi){

    case "viewCollection":
      return (
        <div className={pointerEventsClass}>
          <EntryOverlay 
            showWindow={showEntryWindow} 
            entryObj={viewedEntry}
            handleExit={exitEditModeAndCloseModal}
            editMode={editMode}
            handleEnterEdit={enterEditMode}
            handleExitEdit={exitEditMode}
            handleSaveEntry={saveEntryToApp}
            />
          <EntriesUi 
            collection={entries} 
            handleWriteNewEntry={showEmptyModal}
            handleClickEntry={viewEntryInModal}/>
        </div>
      )

    default:
      return (
        <div className={pointerEventsClass}>
          <EntryOverlay 
            showWindow={showEntryWindow} 
            entryObj={viewedEntry}
            handleExit={exitEditModeAndCloseModal}
            editMode={editMode}
            handleEnterEdit={enterEditMode}
            handleExitEdit={exitEditMode}
            handleSaveEntry={saveEntryToApp}
            />
          <WelcomeUi 
            username="Centisully" 
            enterViewScreenHandler={enterViewScreen} 
            enterWriteScreenHandler={showEmptyModal}/>
        </div>
      )
  }
}

export default App







