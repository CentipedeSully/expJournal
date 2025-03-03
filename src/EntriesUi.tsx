import * as entryDefs from "./entry"
import { SmallButton } from "./uiComponents"
import React from "react"
import { useState, useEffect } from "react"


interface EntryUiProps{
    collection:entryDefs.Entry[],
    dbOperationCode:number
    handleWriteNewEntry:any,
    handleClickEntry:any,
    handleRefreshClick:any
}
const EntriesUi = (props:EntryUiProps)=> {

    const [viewableEntries,setView] = useState(props.collection)
    const [titleFilter,setTitleFilter] = useState('')
    const [keywordCollection,setKeywordCollection] = useState([])
    const [categoryCollection,setCategoryCollection] = useState([])

    useEffect(()=>{
        UpdateView(titleFilter,keywordCollection,categoryCollection)
    },[props.collection])


    const addKeyword = (newKeyword:string) =>{
        if (!keywordCollection.includes(newKeyword)){
            const newKeyCollection = keywordCollection.concat(newKeyword)
            setKeywordCollection(newKeyCollection)

            //refilter the view
            UpdateView(titleFilter,newKeyCollection,categoryCollection)
        }
    } 
    const removeKeyword = (keyword:string) => {
        if (keywordCollection.includes(keyword)){
            const newKeyCollection = keywordCollection.filter((word)=> word!==keyword)
            setKeywordCollection(newKeyCollection)
            
            //refilter the view
            UpdateView(titleFilter,newKeyCollection,categoryCollection)
        }
    }

    const addCategory = (newCategory:string) => {
        if (!categoryCollection.includes(newCategory)){
            const newCatCollection = categoryCollection.concat(newCategory)
            setCategoryCollection(newCatCollection)

            
            //refilter
            UpdateView(titleFilter,keywordCollection,newCatCollection)
        }
    }

    const removeCategory = (category:string) => {
        if (categoryCollection.includes(category)){
            const newCatCollection = categoryCollection.filter((word)=> word!==category)
            setCategoryCollection(newCatCollection)

            //refilter
            UpdateView(titleFilter,keywordCollection,newCatCollection)
        }

        
    }

    const updateTitleFilter = (newTitle:string) => {
        const title = newTitle.toLowerCase()
        setTitleFilter(title)

        //refilter the view
        UpdateView(title,keywordCollection,categoryCollection)
        
    }

    const UpdateView = (title:string,keywords:string[],categories:string[])=>{

        const titleFilteredView = props.collection.filter((entry)=>{ 
            return entry.title.toLowerCase().includes(title) })

        //console.log("Title filtered entries:",titleFilteredView)
        
        const titCatFilteredView = titleFilteredView.filter((entry)=>{
            return categories.every(category => entry.categories.includes(category))})

        //console.log("Title & Category filtered entries:",titCatFilteredView)

        const titCatKeyFilteredView = titCatFilteredView.filter((entry)=>{
            return keywords.every(keyword => entry.keywords.includes(keyword))})

        //console.log("Title, Category, & Keyword filtered entries:",titCatKeyFilteredView)
        setView(titCatKeyFilteredView)
    }


    return(
      <div className="flex flex-col px-10">
        
        <CollectionHeader />
        <FilterArea
            handleTitleInputChange={updateTitleFilter}
            handleAddCategoryToFilter={addCategory}
            handleRemoveCategoryFromFilter={removeCategory}
            handleAddKeywordToFilter={addKeyword}
            handleRemoveKeywordFromFilter={removeKeyword}
            appliedCategories={categoryCollection}
            appliedKeywords={keywordCollection}/>
        <CollectionDisplay 
            collection={viewableEntries} 
            messageCode={props.dbOperationCode}
            handleNewEntryClick={props.handleWriteNewEntry}
            handleEntryClick={props.handleClickEntry}
            handleRefreshClick={props.handleRefreshClick}
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

interface filterProps{
    handleTitleInputChange:any,
    handleAddKeywordToFilter:any,
    handleRemoveKeywordFromFilter:any,
    handleAddCategoryToFilter:any,
    handleRemoveCategoryFromFilter:any,
    appliedCategories:string[],
    appliedKeywords:string[],

}

const FilterArea = (props:filterProps) =>{


    const [catVisibility,setCatVisibility] = useState(props.appliedCategories.length > 0)
    const [keyVisibility,setKeyVisibility] = useState(props.appliedKeywords.length > 0)
    const [keyword,setKeyword] = useState('')
    const [category,setCategory] = useState('')

    const updateKeyword = (event:any) =>{
        const newKeyword = event.target.value
        setKeyword(newKeyword)
    }

    const updateCategory = (event:any) =>{
        const newCategory = event.target.value
        setCategory(newCategory)
    }
    
    useEffect(()=>{
        setCatVisibility(props.appliedCategories.length > 0)
        setKeyVisibility(props.appliedKeywords.length > 0)
    }, [props.appliedCategories, props.appliedKeywords])

    const visibilityClass = catVisibility||keyVisibility ? " hidden" : " visible"
    const categoryVisibility = catVisibility ? " visible" : " hidden"
    const keywordsVisibility = keyVisibility ? " visible" : " hidden"

    const throwNewTitle = (event:any) =>{
        const newTitle = event.target.value
        props.handleTitleInputChange(newTitle)
    }

    const removeKeywordLabel = (event:any) =>{
        const closest = event.target.closest("li")
        props.handleRemoveKeywordFromFilter(closest.id.slice("keyword-filter-item-".length))
        
    }

    const removeCategoryLabel = (event:any) =>{
        const closest = event.target.closest("li")
        props.handleRemoveCategoryFromFilter(closest.id.slice("category-filter-item-".length))
    }

    const addKeyword = () =>{
        props.handleAddKeywordToFilter(keyword)
    }

    const addCategory= () =>{
        props.handleAddCategoryToFilter(category)
    }

    return (
        <div className="py-4 ">
            <div className="border rounded">

                <div className="hover:bg-gray-900">
                    <p className="text-center pt-1">Filter View</p>
                    <form action="" className="flex flex-col py-3 gap-2">

                        <div>
                            <div className="flex flex-col items-center">
                                <input 
                                    id='title-filter-input' 
                                    type="text" 
                                    className=" bg-gray-700 rounded"
                                    onChange={throwNewTitle}
                                    />
                                <label className="text-sm" htmlFor='title-filter-input'>Title</label>
                            </div>
                        </div>

                        <div className="flex flex-row justify-around">

                            <div className="flex flex-col items-center">
                                <div className="flex flex-row gap-1 ">
                                    <input 
                                        id="category-filter-input" 
                                        type="text" 
                                        className=" bg-gray-700 rounded "
                                        onChange={updateCategory}/>
                                    <button 
                                        className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                                        onClick={addCategory}
                                        type="button"
                                    >+</button>
                                </div>
                                <label className="text-sm" htmlFor='category-filter-input'>Category</label>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="flex flex-row gap-1">
                                    <input 
                                        id='keyword-filter-input' 
                                        type="text" 
                                        className=" bg-gray-700 rounded"
                                        onChange={updateKeyword}/>
                                    <button 
                                        className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                                        onClick={addKeyword}
                                        type="button"
                                        >+</button>
                                    </div>
                                <label className="text-sm" htmlFor='keyword-filter-input'>Keyword</label>
                            </div>

                        </div>

                    </form>
                </div>
                
                <hr />

                <div className="py-3 hover:bg-gray-900">
                    <p className={"text-center" + visibilityClass}>-No Cat/Key Applied-</p>
                    <div className="flex flex-row justify-around text-center">

                        <div className={"w-50" + categoryVisibility}>
                            <p>Categories</p>
                            <ul>
                            { props.appliedCategories.map((word)=>{ 

                                const elementId = 'category-filter-item-' + word
                                return(

                                    <li 
                                        className='text-sm hover:bg-blue-900'
                                        key={word}
                                        id={elementId}>
                                        <div className="flex flex-row justify-center gap-1 items-center">
                                            <span>
                                                {word}
                                            </span>
                                            <span>
                                                <button 
                                                    className="rounded px-1  hover:bg-red-950"
                                                    onClick={removeCategoryLabel}
                                                    type="button"
                                                >( x )</button>
                                            </span>
                                        </div>
                                        
                                    </li>
                                )})}
                            </ul>
                        </div>

                        <div className={"w-50" + keywordsVisibility}>
                            <p>Keywords</p>
                            <ul className="">
                                { props.appliedKeywords.map((word)=>{ 

                                    const elementId = 'keyword-filter-item-' + word
                                    return(

                                        <li 
                                            className='text-sm hover:bg-blue-900'
                                            key={word}
                                            id={elementId}>
                                            <div className="flex flex-row justify-center gap-1 items-center">
                                                <span>
                                                    {word}
                                                </span>
                                                <span>
                                                    <button 
                                                        className="rounded px-1  hover:bg-red-950"
                                                        onClick={removeKeywordLabel}
                                                        type="button"
                                                    >( x )</button>
                                                </span>
                                            </div>
                                            
                                        </li>
                                )})}
                            </ul>
                        </div>
                    </div>
                </div>
                                
                
            </div>
        </div>
    )
}

interface CollectionDisplayProps{
    collection:entryDefs.Entry[],
    messageCode:number,
    handleNewEntryClick:any,
    handleEntryClick:any,
    handleRefreshClick:any
}
const CollectionDisplay = (props:CollectionDisplayProps)=>{



    /*Message Codes:
        0: no Message
        1: Fetching Data
        2: Fetch Success
        3: Fetch Failure
        4: Updating Db
        5: Db Update Success
        6: Db Update Failure
    */

    const emptyMessage = ""
    const emptyDate = "---"
    const [message,setMessage] = useState(emptyMessage)
    const [timeout,trackNewTimeout] = useState(null)
    const [lastUpdated,setUpdateTime] = useState(emptyDate)
    const fetchInProgress = "fetching data . . ."
    const fetchSuccess = "data RETRIEVED"
    const fetchFailure = "FAILED to retrieve data"
    const dbUpdateInProgress = "sending data . . ."
    const dbUpdateSuccess = "database UPDATED"
    const dbUpdateFailure = "FAILED to update database"




    //clear the fetch message once it completes
    useEffect(()=>{
        ManageMessageVisual()
    },[props.messageCode])

    //Function below taken from google, then tweaked.
    //Didn't feel like writing Military-> nonMilitarty from scratch XD
    function getCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
      
        const boundHours = hours % 12;
        const nonMilitaryHours = boundHours ? boundHours : 12; // the hour '0' should be '12'
      
        const currentTime = `${nonMilitaryHours}:${minutes} ${ampm}`;
        return currentTime;
    }


    const updateTime = () =>{
        setUpdateTime(`${getCurrentTime()}`)
    }

    const ManageMessageVisual = ()=>{

        //interrupt the timeout function, if one exists
        if (timeout !== null)
        {
            //clear the timeout
            clearTimeout(timeout)

            //reset the tracked id
            trackNewTimeout(null)
        }


        switch (props.messageCode){
            case 1:
                setMessage(fetchInProgress)
                break;

            case 2:
                setMessage(fetchSuccess)
                updateTime()
                trackNewTimeout(setTimeout(timeOutmessage,5000))
                break;

            case 3:
                setMessage(fetchFailure)
                break;

            case 4:
                setMessage(dbUpdateInProgress)
                break;

            case 5:
                setMessage(dbUpdateSuccess)
                trackNewTimeout(setTimeout(timeOutmessage,5000))
                break;

            case 6:
                setMessage(dbUpdateFailure)
                break;

            default:
                setMessage(emptyMessage)
                break;
                
        }
    }

    const timeOutmessage = ()=>{
        setMessage(emptyMessage)
    }

    return (
        <div>
            <div className="flex flex-row justify-between px-10 pb-1">
                <h2>Entries</h2>

                
                <div className="flex flex-row space-x-2 ">

                    <div className="hover:bg-blue-950 rounded">
                        <p className={message === emptyMessage ? "" : 'px-2'}>{message}</p>
                    </div>

                    <p className="text-sm mt-1">-last updated: {lastUpdated}-</p>

                    <SmallButton 
                        label={"Refresh"}
                        onClick={props.handleRefreshClick}
                    />
                    <SmallButton 
                        label={"Create New"}
                        onClick={props.handleNewEntryClick}
                    />
                </div>
                
            </div>
            
            <ul className="border rounded">
                {props.collection.map((entry)=>{
                    return (
                        <li  key={entry._id}>
                            <EntryElement 
                                entry={entry}
                                onClick={props.handleEntryClick}
                                />
                        </li>
                        
                    )
                })}
            </ul>
        </div>
    )
}


interface entryProps{
    entry:entryDefs.Entry
    onClick:any
}
const EntryElement = (props:entryProps) => {

    const throwEntry = () =>{
        props.onClick(props.entry)
    }

    return(
        <div 
            className="hover:border px-1 hover:bg-blue-900"
            onClick={throwEntry}>
            <span>
                {props.entry.dateMMDDYYYY}
            </span>
            <span> --------------- </span>
            <span>{props.entry.title}</span>
        </div>
    )
}



