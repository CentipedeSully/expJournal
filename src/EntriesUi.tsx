import * as entryDefs from "./entry"
import { InputArea, SmallButton } from "./uiComponents"
import React from "react"


interface EntryUiProps{
    collection:entryDefs.Entry[],
    handleWriteEntryClick:any
}
const EntriesUi = (props:EntryUiProps)=> {

    return(
      <div className="flex flex-col px-10">
        
        <CollectionHeader />
        <FilterArea />
        <CollectionDisplay 
            collection={props.collection} 
            handleAddEntryClick={props.handleWriteEntryClick}
        />
        
      </div>
    )
}


export default EntriesUi




const CollectionHeader = () =>{
    return(
        <div className="px-10">
            <h1 className="text-4xl ">Archive</h1>
        </div>
    )
}

const FilterArea = () =>{
    return (
        <div className="py-4">
            <div className="hover:bg-gray-900 border rounded">
                <p className="text-center pb-3 pt-1">Filter View</p>
                <form action="" className="flex flex-row justify-between pb-4 px-5">
                    <InputArea elementId="category-filter" label="Category"/>
                    <InputArea elementId="keyword-filter" label="Keyword"/>
                    <InputArea elementId="title-filter" label="Title"/>
                </form>
            </div>
        </div>
    )
}

interface CollectionDisplayProps{
    collection:entryDefs.Entry[],
    handleAddEntryClick:any
}
const CollectionDisplay = (props:CollectionDisplayProps)=>{


    return (
        <div>
            <div className="flex flex-row justify-between px-10 pb-1">
                <h2 className="">Entries</h2>
                <SmallButton 
                    label={"Create New"}
                    onClick={props.handleAddEntryClick}
                />
            </div>
            
            <ul className="border rounded">
                {props.collection.map((entry)=>{
                    return (
                        <li  key={entry.id}>
                            <EntryElement entry={entry}/>
                        </li>
                        
                    )
                })}
            </ul>
        </div>
    )
}


interface entryProps{
    entry:entryDefs.Entry
}
const EntryElement = (props:entryProps) => {
    return(
        <div className="hover:border px-1 hover:bg-blue-900">
            <span>
                {props.entry.dateMMDDYYYY}
            </span>
            <span> --------------- </span>
            <span>{props.entry.title}</span>
        </div>
    )
}



