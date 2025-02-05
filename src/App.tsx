import * as entryDefs from "./entry"
import { useState } from "react"
import Button from "./uiComponents"
import WelcomeUi from "./WelcomeUi"

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
          <Collection collection={collection}/>
        </div>
      )

    case "viewEntry":
      return (
        <div>
          <ViewEntry entry={viewedEntry} />
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


//=========================================================================================
//=========================================================================================
//View Collection Screen

const Collection = (props:entryDefs.EntryCollection)=> {

  

  return(
    <div>
      <button>create entry</button>
      <p>Currently Viewing Collection...</p>
      <ul>
        {props.collection.map((entry)=>{
          return (
            <li key={entry.id}>{entry.title}</li>
          )
        })}
      </ul>
    </div>
  )
}



//=========================================================================================
//=========================================================================================
//View Entry Screen
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










//=========================================================================================
//=========================================================================================
//


