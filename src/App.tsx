import { useEffect, useState } from "react"
import WelcomeUi from "./WelcomeUi"
import EntriesUi from "./EntriesUi"
import EntryOverlay from "./EntryOverlay"
import { Entry } from "./entry"
import axios from "axios"

const entriesAddress = `http://localhost:8080/journalEntries`

function App() { 

  const getCollectionFromDb = () =>{
    axios.get(entriesAddress).then((response)=>{
      setCollection(response.data)
    })
    
  }

  const getEntryFromDb = (id:string) =>{
    axios.get(entriesAddress +`/${id}`).then((response)=>{
      console.log("found item:",response)
    })
    .catch((error)=>{
      console.log("something unexpected happened:",error)
    })
  }

  const updateEntryInDb = (entry:Entry) =>{
    axios.put(entriesAddress+`/${entry._id}`, entry)
  }
  
  const addEntryToDb = (entry:any)=>{
    axios.post(entriesAddress,entry)
  } 

  const removeEntryFromDb = (id:string) =>{
    axios.delete(entriesAddress+ `/${id}`)
  }
  
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
    if (entry._id.length > 0){
      updateEntryInDb(entry)
      const newTemporaryLocalCollection = entries.filter(item => item._id !== entry._id)
      setCollection(newTemporaryLocalCollection)
      setTimeout(getCollectionFromDb,2000)
    }
      
    
    else{

      const newEntry = {
        title:entry.title,
        content:entry.content,
        categories: entry.categories,
        keywords: entry.keywords,
        dateMMDDYYYY: entry.dateMMDDYYYY
      }

      addEntryToDb(newEntry)
      setTimeout(getCollectionFromDb,2000)
    }
    

  }

  const viewEntryInModal = (entry:Entry) => {
    setViewedEntry(entry)
    setShowEntryWindow(true)
    setIgnoreClicks(true)
    
  }

  const deleteEntry = (id:string) => {
    if (id.length > 0){
      removeEntryFromDb(id)
      const newTemporaryLocalCollection = entries.filter(item => item._id !== id)
      setCollection(newTemporaryLocalCollection)
      setTimeout(getCollectionFromDb,2000)
    }
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
            handleDeleteEntry={deleteEntry}
            />
          <EntriesUi 
            collection={entries} 
            handleWriteNewEntry={showEmptyModal}
            handleClickEntry={viewEntryInModal}
            handleRefreshClick={getCollectionFromDb}/>
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
            handleDeleteEntry={deleteEntry}
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







