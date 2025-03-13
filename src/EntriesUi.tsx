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
            <h1 className="text-4xl">Archive</h1>
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

    const showOnNone = catVisibility||keyVisibility ? " hidden" : " visible"
    const showOnAny = catVisibility||keyVisibility ? " visible" : " hidden"
    const categoryVisibility = catVisibility ? " visible" : " hidden"
    const keywordsVisibility = keyVisibility ? " visible" : " hidden"
    const lgCatColumns = props.appliedCategories.length === 1 ? "columns-1" : "columns-2"
    const lgKeyColumns = props.appliedKeywords.length === 1 ? "columns-1" : "columns-2"

    

    const calcLxCatColumns = ():string=>{

        const categories = props.appliedCategories.length
        if (categories === 0)
            return "columns-1"
        else if (categories<3)
            return `columns-${categories}`
        else return 'columns-3'
    }

    const calcLxKeyColumns = ():string=>{

        const keywords = props.appliedKeywords.length
        if (keywords === 0)
            return "columns-1"
        else if (keywords<3)
            return `columns-${keywords}`
        else return 'columns-3'
    }


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
        <div className="py-4">

            <p className="text-center pb-1">-- Filter Settings --</p>
            <div className="flex sm:flex-col md:flex-row-reverse lg:flex-row-reverse border rounded">

                <div className="hover:bg-gray-900 px-6 pt-5 pb-3">
                    <form action="" className="flex flex-col gap-3">

                        <div>
                            <div className="flex flex-col sm:items-center">
                                <div>
                                    <input 
                                        id='title-filter-input' 
                                        type="text" 
                                        className=" bg-gray-700 rounded"
                                        onChange={throwNewTitle}
                                    />
                                    <button 
                                        className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm invisible'
                                        onClick={null}
                                        type="button"
                                    >+</button>
                                </div>
                                
                                
                                <label className="text-sm text-center" htmlFor='title-filter-input'>Title</label>
                            </div>
                        </div>

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

                    </form>
                </div>
                
                <hr className="sm:visible md:hidden lg:hidden"/>


                <div className=" pb-3 hover:bg-gray-900 w-full ">
                    <div className={"flex flex-col h-full "}>

                        <p className={"pb-5 text-center my-auto" + showOnNone}>( No category/keyword applied )</p>

                        <div className={"flex flex-row justify-evenly py-3 text-center" + showOnAny}>
                            <div className={categoryVisibility + ""}>
                                <p>Categories</p>
                                <ul className={"h-30 rounded overflow-auto whitespace-nowrap space-y-1.5 pt-0.5 " + `lg:${lgCatColumns} lx:${calcLxCatColumns()}`}>
                                { props.appliedCategories.map((word)=>{ 

                                    const elementId = 'category-filter-item-' + word
                                    return(

                                        <li 
                                            className='rounded text-sm hover:bg-amber-950 w-30  overflow-x-auto bg-gray-800 px-2'
                                            key={word}
                                            id={elementId}>
                                            <div className="flex flex-row justify-end gap-1">
                                                <span className="w-full text-start overflow-x-auto">
                                                    {word}
                                                </span>
                                                <span>
                                                    <button 
                                                        className="rounded  hover:bg-red-900  whitespace-nowrap"
                                                        onClick={removeCategoryLabel}
                                                        type="button"
                                                    >( - )</button>
                                                </span>
                                            </div>
                                            
                                        </li>
                                    )})}
                                </ul>
                            </div>

                            <div className={ keywordsVisibility}>
                                <p>Keywords</p>
                                <ul className={"h-30 rounded overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5 " + `lg:${lgKeyColumns} lx:${calcLxKeyColumns()}`}>
                                    { props.appliedKeywords.map((word)=>{ 

                                        const elementId = 'keyword-filter-item-' + word
                                        return(

                                            <li 
                                                className='rounded text-sm hover:bg-amber-950 w-30 overflow-x-auto bg-gray-800 px-2 '
                                                key={word}
                                                id={elementId}>
                                                <div className="flex flex-row justify-end gap-1">
                                                    <span className="w-full text-start overflow-x-auto">
                                                        {word}
                                                    </span>
                                                    <span>
                                                        <button 
                                                            className="rounded hover:bg-red-900 whitespace-nowrap"
                                                            onClick={removeKeywordLabel}
                                                            type="button"
                                                        >( - )</button>
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
        </div>
    )
}
//<p className={"text-center pb-1" + visibilityClass}>-No Category/Keyword Applied-</p>

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


    const gettingStartedTitle = "Getting Started"
    const gettingStartedTip = "( ^ Select a topic )"
    const gettingStartedBodyContent = [
        {
            key:'0',
            header:"Purpose",
            paragraphs:[{
                key:'0',
                value:'This app serves as an online repository of notes that\'re categorized, dated, and organized for convenient access-- or an online journal, stated simply.'
            }]
        },
        {
            key:'1',
            header:"Quick Start",
            paragraphs:[{
                key:'0',
                value:'Click on any Entry within the list to read it\'s contents. To find a specific entry, use the filter area to narrow down the displayed results.'
            }]
        }
    ]

    const usingFiltersTitle = "Using Filters"
    const usingFiltersTip=""
    const usingFiltersContent = [
        {
            key:'0',
            header:"Simple Search",
            paragraphs:[{
                key:'0',
                value:'Type in a title to narrow down the entries by title. ' + 
                    'Entry titles are not unique, meaning many different entries with similar title may exist. ' + 
                    'Add greater specificity by adding more keywords and a category to the query.'
            },
            {
                key:'1',
                value:'When adding a title, the collection will update itself immediately. No added validation is necessary. '+
                    'When adding a keyword or category to the query however, confirm the addition using the [+] button. '+ 
                    'A visual representation of the new query element will appear in the "Filter Settings" area, and then the collection will apply the query and update itself. '+
                    'To remove a query word, hover over the word and click the [-] button. The collection will then apply the edtied query and update itself'
            }]
        },
        {
            key:'1',
            header:"No Entries Displayed?",
            paragraphs:[{
                key:'0',
                value:'Entries will not be displayed for two reasons:'
            },
            {
                key:'1',
                value:'1) There aren\'t any entries matching the query defined by the filters. ' + 
                    'Remove categories, keywords, and/or the current specified title to revisit the available collection.'
            },
            {
                key:'2',
                value:'2) Either the app is still communicating with the database, or the database couldn\'t be reached for some reason. '+ 
                    'Check if a communication status message has appeared under the entries collection display, to the left of the "last updated" time. ' +
                    'Its context will provide a clue to the problem. Otherwise, if no message has presented itself, simply refresh the collection and '+
                    'watch for the communication status message. If it states the data has been received, then no database errors were detected, and ' +
                    'the query should be tailored for a more general case. If no entries aren\'t yet present with no category, keyword, nor title applied, '+
                    'then the database is simply empty, and I apologise for wasting your time ^_^\'' 
            }]
        }
    ]

    const contactTitle = "Contact Info"
    const contactTip = "Need help? Reach out!"
    const contactContent=[
        {
            key:'0',
            header:"LinkedIn",
            paragraphs:[{
                key:'0',
                value:'https://www.linkedin.com/in/william-smith-154a5120a/'
            }]
        },
        {
            key:'1',
            header:"Github",
            paragraphs:[{
                key:'0',
                value:'https://github.com/CentipedeSully'
            }]
        }
        
    ]


    const [guideTitle,setTitle] = useState(gettingStartedTitle)
    const [guideTip,setTip] = useState(gettingStartedTip)
    const [guideBody,setBody] = useState(gettingStartedBodyContent)



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

    interface guideHeaderProps{
        title:string,
        titleTip:string
    }

    const GuideHeader = (props:guideHeaderProps) =>{

        return(
            <div className="flex justify-between pb-1.5">
                <p className="font-bold text-2xl">{props.title}</p>
                <p className="italic">{props.titleTip}</p>
            </div>
        )
    }

    interface paragraph{
        key:string,
        value:string
    }

    interface bodyContent{
        key:string,
        header:string,
        paragraphs:paragraph[]
    }

    interface guideBodyProps{
        bodyContentList:bodyContent[]
    }

    const GuideBody = (props:guideBodyProps) => {


        return(
            <div className="overflow-y-auto h-38">
                {props.bodyContentList.map((contentItem)=>{
                    return(
                        <div key={contentItem.key}>
                            <p className="font-bold">{contentItem.header}</p>
                            <div className="pl-5">
                                {contentItem.paragraphs.map((paragraph)=>{
                                    return(
                                        <div key={paragraph.key}>
                                            <p>{paragraph.value}</p>
                                            <br />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    const showGetStarted = ()=>{
        setTitle(gettingStartedTitle)
        setTip(gettingStartedTip)
        setBody(gettingStartedBodyContent)
    }

    const showUseFilters = ()=>{
        setTitle(usingFiltersTitle)
        setTip(usingFiltersTip)
        setBody(usingFiltersContent)
    }
    const showContact = ()=>{
        setTitle(contactTitle)
        setTip(contactTip)
        setBody(contactContent)
    }


    return (
        <div>
            <div id="content-area" className="flex gap-2 sm:flex-col-reverse md:flex-col-reverse lg:flex-row xl:flex-row">
                <div id="guide-area " className="sm:w-full md:w-full lg:w-1/2 xl:w-1/2">
                    <div  id="guide-header" className="flex flex-row justify-between px-10 pb-1">
                        <h2>Guide</h2>
                        
                        <div className="flex flex-row space-x-2 ">

                            <SmallButton 
                                label={"Getting Started"}
                                onClick={showGetStarted}
                            />

                            <SmallButton 
                                label={"Filters"}
                                onClick={showUseFilters}
                            />
                            <SmallButton 
                                label={"Contact"}
                                onClick={showContact}
                            />
                        </div>
                    </div>

                    <div id="guide-body" className="border rounded h-50 hover:bg-gray-900">
                        <div className="px-5 py-1">
                            <GuideHeader title={guideTitle} titleTip={guideTip}/>
                            <GuideBody bodyContentList={guideBody} />
                        </div>
                    </div>
                </div>

                <div id="entry-area" className="sm:w-full md:w-full lg:w-1/2 xl:w-1/2">
                    <div  id="entry-header" className="flex flex-row justify-between px-10 pb-1">
                        <h2>Entries</h2>
                        
                        <div className="flex flex-row space-x-2 ">

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
                    
                    <div id="entry-list" className="border rounded h-50">
                        <ul className={""} >
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

                    <div id="entry-footer" className="flex justify-between px-10 pb-1">
                        <div className="hover:bg-blue-950 rounded">
                            <p className={message === emptyMessage ? "" : 'px-2'}>{message}</p>
                        </div>

                        <p className="text-sm mt-1">-last updated: {lastUpdated}-</p>
                        
                    </div>
                </div>
            </div>
            
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
            className="hover:border hover:bg-blue-900 flex px-2 space-x-2"
            onClick={throwEntry}>
            <span>{props.entry.dateMMDDYYYY}</span>
            <span className="overflow-x-auto w-full whitespace-nowrap px-1 text-end">{props.entry.title}</span>
        </div>
    )
}



