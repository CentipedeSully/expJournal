import { useState } from "react"
import WelcomeUi from "./WelcomeUi"
import EntriesUi from "./EntriesUi"


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

  

    const enterViewScreen = () =>{
      setUi("viewCollection")
    }

    const enterWriteScreen= () => {
      setUi("viewEntry")
    }




  switch(currentUi){

    case "viewCollection":
      return (
        <div>
          <EntriesUi 
            collection={collection} 
            handleWriteEntryClick={enterWriteScreen}/>
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
          <WelcomeUi 
            username="Centisully" 
            enterViewScreenHandler={enterViewScreen} 
            enterWriteScreenHandler={enterWriteScreen}/>
        </div>
      )
  }
}

export default App




//=========================================================================================
//View Entry Screen
/*
interface entryProps{
  entry:entryDefs.Entry
}

const ViewEntry = (props:entryProps)=> {


  return(
    <div>
      <p>{props.entry.dateCreated.getDate()}</p>
      <h1>{props.entry.title}</h1>
      <p>{props.entry.content}</p>
    </div>
  )
}
*/



