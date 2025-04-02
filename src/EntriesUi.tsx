import * as entryDefs from "./entry"
import { SmallButton } from "./uiComponents"
import React from "react"
import { useState, useEffect } from "react"


interface EntryUiProps{
    collection:entryDefs.Entry[],
    keywords:string[],
    categories:string[],
    dbOperationCode:number
    handleWriteNewEntry:any,
    handleClickEntry:any,
    handleRefreshClick:any,
    handleLogout:any,
    user:string
}



const EntriesUi = (props:EntryUiProps)=> {

    const [viewableEntries,setView] = useState(props.collection)
    const [titleFilter,setTitleFilter] = useState('')
    const [appliedKeywordsCollection,setAppliedKeywordsCollection] = useState([])
    const [appliedCategoryCollection,setAppliedCategoryCollection] = useState([])

    useEffect(()=>{
        UpdateView(titleFilter,appliedKeywordsCollection,appliedCategoryCollection)
    },[props.collection])


    const addKeyword = (newKeyword:string) =>{
        if (!appliedKeywordsCollection.includes(newKeyword)){
            const newKeyCollection = appliedKeywordsCollection.concat(newKeyword)
            setAppliedKeywordsCollection(newKeyCollection)

            //refilter the view
            UpdateView(titleFilter,newKeyCollection,appliedCategoryCollection)
        }
    } 
    const removeKeyword = (keyword:string) => {
        if (appliedKeywordsCollection.includes(keyword)){
            const newKeyCollection = appliedKeywordsCollection.filter((word)=> word!==keyword)
            setAppliedKeywordsCollection(newKeyCollection)
            
            //refilter the view
            UpdateView(titleFilter,newKeyCollection,appliedCategoryCollection)
        }
    }

    const addCategory = (newCategory:string) => {
        if (!appliedCategoryCollection.includes(newCategory)){
            const newCatCollection = appliedCategoryCollection.concat(newCategory)
            setAppliedCategoryCollection(newCatCollection)

            
            //refilter
            UpdateView(titleFilter,appliedKeywordsCollection,newCatCollection)
        }
    }

    const removeCategory = (category:string) => {
        if (appliedCategoryCollection.includes(category)){
            const newCatCollection = appliedCategoryCollection.filter((word)=> word!==category)
            setAppliedCategoryCollection(newCatCollection)

            //refilter
            UpdateView(titleFilter,appliedKeywordsCollection,newCatCollection)
        }

        
    }

    const updateTitleFilter = (newTitle:string) => {
        const title = newTitle.toLowerCase()
        setTitleFilter(title)

        //refilter the view
        UpdateView(title,appliedKeywordsCollection,appliedCategoryCollection)
        
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
        
        <CollectionHeader 
            user={props.user}
            handleLogout={props.handleLogout}/>
        <FilterArea
            handleTitleInputChange={updateTitleFilter}
            handleAddCategoryToFilter={addCategory}
            handleRemoveCategoryFromFilter={removeCategory}
            handleAddKeywordToFilter={addKeyword}
            handleRemoveKeywordFromFilter={removeKeyword}
            appliedCategories={appliedCategoryCollection}
            appliedKeywords={appliedKeywordsCollection}
            categories={props.categories}
            keywords={props.keywords}/>
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


interface headerProps{
    user:string,
    handleLogout:any
}

const CollectionHeader = (props:headerProps) =>{
    return(
        <div className="px-10">
            <div className="flex flex-row justify-center md:justify-start space-x-5">
                <h1 className="text-4xl">Archive</h1>
                
                <div className="flex flex-row text-sm mt-auto  space-x-1">
                    <p>[ </p>
                    <p className="text-amber-600 whitespace-nowrap"> Viewing as '{props.user}' </p>
                    <p> ]</p>
                </div>

                <div className="mt-auto">
                    <SmallButton 
                        label="Logout"
                        onClick={props.handleLogout}
                    />
                </div>
                
                
                
            </div>
        </div>
    )
}

interface filterProps{
    handleTitleInputChange:any,
    handleAddKeywordToFilter:any,
    handleRemoveKeywordFromFilter:any,
    handleAddCategoryToFilter:any,
    handleRemoveCategoryFromFilter:any,
    categories:string[],
    appliedCategories:string[],
    keywords:string[],
    appliedKeywords:string[]

}

const FilterArea = (props:filterProps) =>{


    const [catVisibility,setCatVisibility] = useState(props.categories.length > 0)
    const [keyVisibility,setKeyVisibility] = useState(props.keywords.length > 0)

    
    useEffect(()=>{
        setCatVisibility(props.categories.length > 0)
        setKeyVisibility(props.keywords.length > 0)
    }, [props.categories, props.keywords])

    const showOnNone = catVisibility||keyVisibility ? " hidden" : " visible"
    const showOnAny = catVisibility||keyVisibility ? " visible" : " hidden"
    const categoryVisibility = catVisibility ? " visible" : " hidden"
    const keywordsVisibility = keyVisibility ? " visible" : " hidden"
    const filterActiveClass = "rounded text-sm hover:bg-yellow-500 w-30 overflow-x-auto bg-orange-800 px-2 border hover:text-gray-950"
    const filterInactiveClass = "rounded text-sm hover:bg-amber-950 w-30 overflow-x-auto bg-gray-800 px-2"



    const throwNewTitle = (event:any) =>{
        const newTitle = event.target.value
        props.handleTitleInputChange(newTitle)
    }

    const toggleCategory = (event:any) =>{
        const closest = event.target.closest("li")
        const catName = closest.id.slice("category-filter-item-".length)
        
        if (props.appliedCategories.includes(catName)){
            props.handleRemoveCategoryFromFilter(catName)
            closest.className = filterInactiveClass
        }
            
        else {
            props.handleAddCategoryToFilter(catName)
            closest.className = filterActiveClass
        }
    }

    const toggleKeyword = (event:any)=>{
        const closest = event.target.closest("li")
        const keyName = closest.id.slice("keyword-filter-item-".length)

        if (props.appliedKeywords.includes(keyName)){
            props.handleRemoveKeywordFromFilter(keyName)
            closest.className = filterInactiveClass

        }
            
        else {
            props.handleAddKeywordToFilter(keyName)
            closest.className = filterActiveClass

        }
    }

    return (
        <div className="py-4">

            <p className="text-center pb-1">-- Filter Settings --</p>
            <div className="flex flex-col md:flex-row-reverse lg:flex-row-reverse border rounded">

                <div className="hover:bg-gray-900 px-6 pt-5 pb-3">
                    <form action="" className="flex flex-col gap-3">

                        <div>
                            <div className="flex flex-col items-center">
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

                    </form>
                </div>
                
                <hr className="visible md:hidden"/>


                <div className=" pb-3 hover:bg-gray-900 w-full ">
                    <div className={"flex flex-col h-full "}>

                        <p className={"pb-5 text-center my-auto" + showOnNone}>( No category/keyword exists )</p>

                        <div className={"flex flex-row justify-evenly py-3 text-center" + showOnAny}>
                            <div className={categoryVisibility + ""}>
                                <p>Categories</p>
                                <ul className={"h-30 rounded overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5 lg:columns-2"}>
                                { props.categories.map((word)=>{ 

                                    const elementId = 'category-filter-item-' + word
                                    return(

                                        <li 
                                            className={filterInactiveClass}
                                            key={word}
                                            id={elementId}
                                            onClick={toggleCategory}>
                                            {word}
                                        </li>
                                    )})}
                                </ul>
                            </div>

                            <div className={ keywordsVisibility}>
                                <p>Keywords</p>
                                <ul className={"h-30 rounded overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5 lg:columns-2"}>
                                    { props.keywords.map((word)=>{ 

                                        const elementId = 'keyword-filter-item-' + word
                                        return(

                                            <li 
                                                className={filterInactiveClass}
                                                key={word}
                                                id={elementId}
                                                onClick={toggleKeyword}>
                                                {word}
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
        7: Restricted Action
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
    const restrictedAction = "- Guests may only read entries -"


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

            case 7:
                setMessage(restrictedAction)
                trackNewTimeout(setTimeout(timeOutmessage,5000))
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
            <div id="content-area" className="flex gap-2 flex-col-reverse lg:flex-row">
                <div id="guide-area " className="w-full lg:w-1/2">
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

                <div id="entry-area" className="sm:w-full lg:w-1/2">
                    <div  id="entry-header" className="flex flex-row justify-between px-10 pb-1">
                        <div>
                            <h2>Entries</h2>                            
                        </div>
                        
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
                    
                    <div id="entry-list" className="border rounded h-50 overflow-y-auto">
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



