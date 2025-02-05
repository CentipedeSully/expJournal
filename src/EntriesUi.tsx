import * as entryDefs from "./entry"
import AccentButton, { FilterInputArea, SmallButton } from "./uiComponents"


interface EntryUiProps{
    collection:entryDefs.Entry[],
    handleWriteEntryClick:any
}
const EntriesUi = (props:EntryUiProps)=> {


    return(
      <div className="flex flex-col px-10">
        <CollectionHeader handleAddEntryClick={props.handleWriteEntryClick}/>
        <FilterArea />
        <CollectionDisplay collection={props.collection}/>
      </div>
    )
}


export default EntriesUi



interface headerProps{
    handleAddEntryClick:any
}

const CollectionHeader = (props:headerProps) =>{
    return(
        <div className="flex justify-between ">
            <h1 className="text-4xl">Archive</h1>
            <SmallButton 
                label={"Create"}
                onClick={props.handleAddEntryClick}
            />
        </div>
    )
}

const FilterArea = () =>{
    return (
        <div className="py-4">
            <form action="" className="flex flex-row justify-between">
                <FilterInputArea elementId="category-filter" label="Category"/>
                <FilterInputArea elementId="keyword-filter" label="Keyword"/>
                <FilterInputArea elementId="title-filter" label="Title"/>
            </form>
        </div>
    )
}

interface CollectionDisplayProps{
    collection:entryDefs.Entry[]
}
const CollectionDisplay = (props:CollectionDisplayProps)=>{


    return (
        <div>
            <h2>Entries</h2>
            <ul className="border">
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
        <div className="hover:border px-1">
            <span>
                {props.entry.dateCreated.getMonth()}/
                {props.entry.dateCreated.getDate()}/
                {props.entry.dateCreated.getFullYear()}
            </span>
            <span> --------------- </span>
            <span>{props.entry.title}</span>
        </div>
    )
}
