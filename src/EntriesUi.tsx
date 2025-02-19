import * as entryDefs from "./entry"
import { SmallButton } from "./uiComponents"
import React from "react"
import { useState, useEffect } from "react"


interface EntryUiProps{
    collection:entryDefs.Entry[],
    handleWriteNewEntry:any,
    handleClickEntry:any,
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
        console.log("title update detected:", title)
        setTitleFilter(title)

        //refilter the view
        UpdateView(title,keywordCollection,categoryCollection)
        
    }

    const UpdateView = (title:string,keywords:string[],categories:string[])=>{

        const titleFilteredView = props.collection.filter((entry)=>{ 
            return entry.title.toLowerCase().includes(title) })

        console.log("Title filtered entries:",titleFilteredView)
        
        const titCatFilteredView = titleFilteredView.filter((entry)=>{
            return categories.every(category => entry.categories.includes(category))})

        console.log("Title & Category filtered entries:",titCatFilteredView)

        const titCatKeyFilteredView = titCatFilteredView.filter((entry)=>{
            return keywords.every(keyword => entry.keywords.includes(keyword))})

        console.log("Title, Category, & Keyword filtered entries:",titCatKeyFilteredView)
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
            handleNewEntryClick={props.handleWriteNewEntry}
            handleEntryClick={props.handleClickEntry}
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
    handleNewEntryClick:any,
    handleEntryClick:any
}
const CollectionDisplay = (props:CollectionDisplayProps)=>{


    return (
        <div>
            <div className="flex flex-row justify-between px-10 pb-1">
                <h2 className="">Entries</h2>
                <SmallButton 
                    label={"Create New"}
                    onClick={props.handleNewEntryClick}
                />
            </div>
            
            <ul className="border rounded">
                {props.collection.map((entry)=>{
                    return (
                        <li  key={entry.id}>
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



