import { useState } from "react"
import WelcomeUi from "./WelcomeUi"
import EntriesUi from "./EntriesUi"
import EntryOverlay from "./EntryOverlay"




function App() {

  
  const collection= [
    
    {
      id:'0000',
      title:"hoard",
      content:"hoard all the treasure.",
      categories: ["goals","test entries"],
      keywords:["treasure","hoard"],
      dateCreated: new Date()
    },
    {
      id:'0001',
      title:"Hello World",
      content:"Hello world! This it the first entry! Woo!",
      categories: ["milestones","test entries"],
      keywords:["hello world","first"],
      dateCreated: new Date()
    },
    {
      id:'0002',
      title:"Feb2025 ToDo",
      content:"Chill\nChill\nWork\nChill",
      categories: ["Tasklists","test entries"],
      keywords:["todo"],
      dateCreated: new Date()
    }
  ]

  


  const [currentUi, setUi] = useState("welcome")
  const [entries,setCollection] = useState(collection)
  const [viewedEntry, setViewedEntry] = useState(collection[0])
  const [showEntryWindow,setShowEntryWindow] = useState(false)
  
    
  const enterViewScreen = () =>{
    setUi("viewCollection")
  }

  const enterWriteScreen= () => {
    setUi("viewEntry")
  }

  const hideEntryModal = () =>{
    setShowEntryWindow(false)
  }

  const showEntryModal = () =>{
    setShowEntryWindow(true)
  }

  


  switch(currentUi){

    case "viewCollection":
      return (
        <div>
          <EntryOverlay 
            showWindow={showEntryWindow} 
            entryObj={viewedEntry}
            handleExit={hideEntryModal}/>
          <EntriesUi 
            collection={collection} 
            handleWriteEntryClick={showEntryModal}/>
        </div>
      )

    case "viewEntry":
      return (
        <div>
          <p>Viewing Entry...</p>
        </div>
      )

    default:
      return (
        <div>
          <EntryOverlay 
            showWindow={showEntryWindow} 
            entryObj={viewedEntry}
            handleExit={hideEntryModal}/>
          <WelcomeUi 
            username="Centisully" 
            enterViewScreenHandler={enterViewScreen} 
            enterWriteScreenHandler={showEntryModal}/>
        </div>
      )
  }
}

export default App







