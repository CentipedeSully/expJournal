import { useEffect, useState } from "react"
import WelcomeUi from "./WelcomeUi"
import EntriesUi from "./EntriesUi"
import EntryOverlay from "./EntryOverlay"
import { Entry } from "./entry"
import axios from "axios"


console.log("App mode:", import.meta.env.MODE)
const appMode = import.meta.env.MODE
const devBackendUrl = import.meta.env.VITE_DEV_BACKEND + '/journalEntries'
const prodBackendUrl = import.meta.env.VITE_PROD_BACKEND + '/journalEntries'



function App() { 

  const getCollectionFromDb = () =>{
    if (appMode === 'development'){
      axios.get(devBackendUrl)
      .then((response)=>{
        setCollection(response.data)
      })
      .catch(error =>{
        console.log('error fetching data from db:',error)
      })
    }
    else {
      axios.get(prodBackendUrl)
      .then((response)=>{
        setCollection(response.data)
      })
      .catch(error =>{
        console.log('error fetching data from db:',error)
      })
    }
    
    
  }

  const getEntryFromDb = (id:string) =>{
    if (appMode === 'development'){
      axios.get(devBackendUrl +`/${id}`).then((response)=>{
        console.log("found item:",response)
      })
      .catch((error)=>{
        console.log("something unexpected happened:",error)
      })
    }
    else {
      axios.get(prodBackendUrl +`/${id}`).then((response)=>{
        console.log("found item:",response)
      })
      .catch((error)=>{
        console.log("something unexpected happened:",error)
      })
    }
  }

  const updateEntryInDb = (entry:Entry) =>{
    if (appMode === 'development'){
      axios.put(devBackendUrl+`/${entry._id}`, entry)
    }
    else{
      axios.put(prodBackendUrl+`/${entry._id}`, entry)
    }
    
  }
  
  const addEntryToDb = (entry:any)=>{
    if (appMode === "development"){
      axios.post(devBackendUrl,entry)
    }
    else{
      axios.post(prodBackendUrl,entry)
    }
  } 

  const removeEntryFromDb = (id:string) =>{
    if (appMode === 'development'){
      axios.delete(devBackendUrl+ `/${id}`)
    }
    else{
      axios.delete(prodBackendUrl+ `/${id}`)
    }
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
  const [entries,setCollection] = useState([emptyEntry])
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







