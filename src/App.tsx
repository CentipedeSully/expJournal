import { useEffect, useState } from "react"
import WelcomeUi from "./WelcomeUi"
import EntriesUi from "./EntriesUi"
import EntryOverlay from "./EntryOverlay"
import { Entry } from "./entry"
import axios, { AxiosResponse } from "axios"


console.log("App mode:", import.meta.env.MODE)
const appMode = import.meta.env.MODE
const devBackendUrl = import.meta.env.VITE_DEV_BACKEND + '/journalEntries'
const prodBackendUrl = import.meta.env.VITE_PROD_BACKEND + '/journalEntries'
const debugUrl = import.meta.env.VITE_DEV_BACKEND + '/debug_status_codes'

const ResponseResults = Object.freeze({
  success:'success',
  error:'error',
  pending:'pending',
  undefined:'UNDEFINED_RESPONSE_CASE'
})

const timeOut = {
  timeout: 6000
}



function App() { 


  const handleResponse = (response:AxiosResponse) =>{
    const status = response.status
    switch(true){
      case (status >= 100 && status < 200):
        console.log(`Response Status '${status}' detected as 'INFORMATIONAL'`)
        return ResponseResults.pending
      case (status >= 200 && status < 300):
        console.log(`Response Status '${status}' detected as 'SUCCESSFUL'`)
        return ResponseResults.success
      case (status >= 300 && status < 400):
        console.log(`Response Status '${status}' detected as 'REDIRECTION'`)
        return ResponseResults.pending
      case (status >= 400 && status < 500):
        console.log(`Response Status '${status}' detected as 'CLIENT ERROR'`)
        return ResponseResults.error
      case (status >= 500 && status < 600):
        console.log(`Response Status '${status}' detected as 'SERVER ERROR'`)
        return ResponseResults.error
      default:
        console.log(`failed to resolve response of status '${status}'`)
        return ResponseResults.undefined
    }
  }

  /*
  const testResponseReading = (desiredStatusCode:number)=>{
    console.log(`testing response handling for code '${desiredStatusCode}'...`)
    axios.get(debugUrl + `/${desiredStatusCode.toString()}`).then((response)=>{
      handleResponse(response)
    }).catch((err)=>{
      console.log(`Couldn't reach debug server for some reason. Aborted testing for expected code '${desiredStatusCode}'\n Error:${err}`)
    })
  }
*/

  const getCollectionFromDb = () =>{
    if (appMode === 'development'){

      setDbCode(1)

      axios.get(devBackendUrl)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(2)
          setCollection(response.data)
        }
        else{
          setDbCode(3)
        }
      })
      .catch(error =>{
        
        setDbCode(3)
        console.log('error fetching data from db:',error)
      })
    }
    else {

      setDbCode(1)

      axios.get(prodBackendUrl)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(2)
          setCollection(response.data)
        }
        else{
          setDbCode(3)
        }
      })
      .catch(error =>{
        setDbCode(3)
        console.log('error fetching data from db:',error)
      })
    }
    
    
  }

  /*
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
    */

  const updateEntryInDb = (entry:Entry) =>{
    if (appMode === 'development'){

      //show the attempt to user
      setDbCode(4)

      axios.put(devBackendUrl+`/${entry._id}`, entry)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(5)
          setTimeout(getCollectionFromDb,3000)
        }
        else{
          setDbCode(6)
        }
      })
      .catch((err)=>{
        setDbCode(6)
      })
    }
    else{

      //show the attempt to user
      setDbCode(4)

      axios.put(prodBackendUrl+`/${entry._id}`, entry)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(5)
          setTimeout(getCollectionFromDb,3000)
        }
        else{
          setDbCode(6)
        }
      })
      .catch((err)=>{
        setDbCode(6)
      })
    }
    
  }
  
  const addEntryToDb = (entry:any)=>{
    if (appMode === "development"){

      //show the attempt to user
      setDbCode(4)

      axios.post(devBackendUrl,entry)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(5)
          setTimeout(getCollectionFromDb,3000)
        }
        else{
          setDbCode(6)
        }
      })
      .catch((err)=>{
        setDbCode(6)
      })
    }
    else{

      //show the attempt to user
      setDbCode(4)

      axios.post(prodBackendUrl,entry)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(5)
          setTimeout(getCollectionFromDb,3000)
        }
        else{
          setDbCode(6)
        }
      })
      .catch((err)=>{
        setDbCode(6)
      })
    }
  } 

  const removeEntryFromDb = (id:string) =>{
    if (appMode === 'development'){

      //show the attempt to user
      setDbCode(4)

      axios.delete(devBackendUrl+ `/${id}`)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(5)
          setTimeout(getCollectionFromDb,3000)
        }
        else{
          setDbCode(6)
        }
      })
      .catch((err)=>{
        setDbCode(6)
      })
    }
    else{

      //show the attempt to user
      setDbCode(4)

      axios.delete(prodBackendUrl+ `/${id}`,)
      .then((response)=>{
        if (handleResponse(response) === ResponseResults.success){
          setDbCode(5)
          setTimeout(getCollectionFromDb,3000)
        }
        else{
          setDbCode(6)
        }
      })
      .catch((err)=>{
        setDbCode(6)
      })
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
  const [dbOperationCode, setDbCode] = useState(0)

      /*Db operation Codes:
        0: nothing/idle
        1: Fetching Data
        2: Fetch Success
        3: Fetch Failure
        4: Updating Db
        5: Db Update Success
        6: Db Update Failure
    */


  //fetch data from the db on app start
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
      //setTimeout(getCollectionFromDb,2000)
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
      //setTimeout(getCollectionFromDb,2000)
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
      //setTimeout(getCollectionFromDb,2000)
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
            dbOperationCode={dbOperationCode}
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







