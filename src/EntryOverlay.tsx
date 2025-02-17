import { createPortal } from "react-dom"
import { Entry } from "./entry"
import { useState } from "react"


const entryModalParent = document.getElementById('overlay-container')

const EntryOverlay = (props:SoloEntryModalProps) => {
    return(
        createPortal(
            <SoloEntryModal 
                showWindow={props.showWindow} 
                entryObj={props.entryObj}
                handleExit={props.handleExit}
                editMode={props.editMode}
                handleEnterEdit={props.handleEnterEdit}
                handleExitEdit={props.handleExitEdit}
                handleUpdateEntry={props.handleUpdateEntry}
                />,
            entryModalParent
        )
        
    )

}

export default EntryOverlay


interface SoloEntryModalProps{
    showWindow:boolean,
    entryObj:Entry | null,
    handleExit:any,
    handleEnterEdit:any,
    handleExitEdit:any,
    editMode:boolean,
    handleUpdateEntry:any
}
  
const SoloEntryModal = (props:SoloEntryModalProps)=>{

    const visibilityString = props.showWindow ? "visible " : "hidden "
    const className = "z-10 w-3/4 h-3/4 mx-auto absolute inset-x-0 rounded " + visibilityString
    const givenEntry:Entry = {
        title:props.entryObj.title,
        keywords:props.entryObj.keywords,
        categories:props.entryObj.categories,
        content:props.entryObj.content,
        dateMMDDYYYY:props.entryObj.dateMMDDYYYY,
        id:props.entryObj.id
    }

    const [title,setTitle] = useState(givenEntry.title)
    const [date,setDate] = useState(givenEntry.dateMMDDYYYY)
    const [content,setContent] = useState(givenEntry.content)
    const [categories,setCategories] = useState(givenEntry.categories)
    const [keywords,setKeywords] = useState(givenEntry.keywords)


    const [changeDetected, setChangeDetected] = useState(false)

    const detectChange = ()=>{
        setChangeDetected(true)
    }
    const clearDetectedChanges = ()=>{
        setChangeDetected(false)
    }

    

    const updateTitle = (event:any)=>{
        const newTitle = event.target.value
        setTitle(newTitle)
        detectChange()
    }
    const updateDate = (event:any)=>{
        const newDate = event.target.value
        setDate(newDate)
        detectChange()
    }
    const updateContent = (event:any)=>{
        const newContent = event.target.value
        setContent(newContent)
        detectChange()
    }
    const addKeyword= (word:string) => {
        if (!keywords.includes(word)){
          const newKeywords= keywords.concat(word)
          setKeywords(newKeywords)
          detectChange()
        }
    }

    const removeKeyword= (word:string) =>{
      if (keywords.includes(word)){
        const newKeywords = keywords.filter((string)=> string!== word)
        setKeywords(newKeywords)
        detectChange()
      }
    }

    const addCategory= (word:string) => {
      if (!categories.includes(word)){
        const newCategories= categories.concat(word)
        setCategories(newCategories)
        detectChange()
      }
  }

  const removeCategory= (word:string) =>{
    if (categories.includes(word)){
      const newCategories = categories.filter((string)=> string!== word)
      setCategories(newCategories)
      detectChange()
    }
  }

    const saveEntry = () =>{
        clearDetectedChanges()

        const updatedEntry:Entry = {
          title:title,
          keywords:keywords,
          categories:categories,
          content:content,
          dateMMDDYYYY:date,
          id:props.entryObj.id
        }

        props.handleUpdateEntry(updatedEntry)
    }

    

    return(
        <div className={className }>
            <div className="py-4 px-4 ">
                <div className=" border rounded bg-bluesteel">

                <HeaderArea 
                    handleBackClick={props.handleExit} 
                    handleEnterEditMode={props.handleEnterEdit}
                    handleExitEditMode={props.handleExitEdit}
                    editMode={props.editMode}
                />
                <hr />
                
                <form action="" >
                    <div className='grid grid-cols-2 py-3'>
                    <CategoriesArea 
                        editedStringList={categories}
                        stringList={givenEntry.categories}
                        editMode={props.editMode}
                        addElement={addCategory}
                        removeElement={removeCategory}
                    />
                    <KeywordsArea 
                        editedStringList={keywords}
                        stringList={givenEntry.keywords}
                        editMode={props.editMode} 
                        addElement={addKeyword}
                        removeElement={removeKeyword}
                    />
                    </div>
                    <hr />

                    <TitleArea 
                        editedTitle={title} 
                        editedDate={date}
                        title={givenEntry.title}
                        date={givenEntry.dateMMDDYYYY}
                        editMode={props.editMode}
                        handleUpdateTitle={updateTitle}
                        handleUpdateDate={updateDate}
                    />
                    <ContentArea 
                        content={givenEntry.content}
                        editedContent={content}
                        editMode={props.editMode}
                        handleUpdateContent={updateContent}
                    /> 
                </form>
                <hr />

                <FooterArea 
                    unsavedChangesDetected={changeDetected}
                    handleSave={saveEntry}
                />
                </div>
            </div>
        </div>
    )
}



interface headerProps{
    handleBackClick:any,
    handleEnterEditMode:any,
    handleExitEditMode:any,
    editMode:boolean
}
const HeaderArea = (props:headerProps)=> {
    const headerText = props.editMode ? "- EDITING -" : "-- Reading Entry --"

    return(
      <div className='flex flex-row items-center justify-between py-5 px-5'>
        <button 
            className='rounded bg-blue-800 hover:bg-blue-950 px-2'
            onClick={props.handleBackClick}
            >Back
        </button>
        <p>{headerText}</p>
        <button 
            className='rounded bg-blue-800 hover:bg-blue-950 px-2'
            onClick={props.editMode ? props.handleExitEditMode : props.handleEnterEditMode}
            >{props.editMode ? "Read" : "Edit"}
        </button>
      </div>
    )
  }
  
  interface footerProps{
    unsavedChangesDetected:boolean,
    handleSave:any
  }
  const FooterArea = (props:footerProps)=> {

    return(
      <div className={'flex items-center justify-end py-5 px-5 '}>
        <button 
            className={'rounded bg-blue-800 hover:bg-blue-950 px-2 '}
            onClick={props.handleSave}>
            {props.unsavedChangesDetected ? "unsaved" : "Saved"}
        </button>
      </div>
    )
  }
  
  interface stringListProps{
    stringList:string[],
    editedStringList:string[],
    editMode:boolean,
    addElement:any,
    removeElement:any

  }
  
  const KeywordsArea = (props:stringListProps) => {
    const showOnEditMode = props.editMode ? " visible" : " hidden"
    const showOnReadMode = props.editMode ? " hidden" : " visible"

    const [keyword,setKeyword] = useState('')

    const updateKeyword =(event:any) =>{
      const newKeyword = event.target.value
      setKeyword(newKeyword)
    }

    const addNewKeyword = () =>{
      props.addElement(keyword)
    }

    const removeKeyword = (event:any) =>{
      const closestLi = event.target.closest('li')
      props.removeElement(closestLi.id.slice("editMode-list-item-".length))
    }

    return(
      <div className='text-center'>
        <p className=''>-- Keywords --</p>
        
        <div className={showOnReadMode}>
          <ul className={'grid grid-cols-2 gap-1 items-center overflow-y-auto py-1 h-25'}>
            {
              props.stringList.map((word)=>{
                return (
                  <li 
                    className='text-sm hover:bg-blue-950' 
                    id={"list-item-" + word}
                    key={word}>
                    {word}
                  </li>
                )
              })
            }
          </ul>
        </div>
        
        <div className={showOnEditMode}>
          <ul className={'grid grid-cols-2 gap-1 items-center overflow-y-auto py-1 h-15 '}>
            {
              props.editedStringList.map((word)=>{
                return (
                  <li 
                    className='text-sm hover:bg-blue-950' 
                    id={"editMode-list-item-" + word}
                    key={word}>
                    <div className="flex flex-row justify-center gap-1 items-center">
                      <span>
                        {word}
                      </span>
                      <span>
                        <button 
                          className={" rounded px-1  hover:bg-red-950 "}
                          onClick={removeKeyword}
                          type="button"
                          >( x )</button>
                      </span>
                    </div>
                    
                  </li>
                )
              })
            }
          </ul>
          <div className={'flex flex-row justify-center pt-1 '}>
            <div className="flex flex-col items-center">
                  <div className='flex flex-row gap-1 px-1'>
                      <input 
                        id='add-keyword-input' 
                        type="text" 
                        className=" bg-gray-700 rounded"
                        onChange={updateKeyword}/>
                      <button 
                          className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                          onClick={addNewKeyword}
                          type="button"
                      >+</button>
                  </div>
                
                <label className="text-sm" htmlFor='add-keyword-input'>add keyword</label>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const CategoriesArea = (props:stringListProps) => {
    const showOnEditMode = props.editMode ? " visible" : " hidden"
    const showOnReadMode = props.editMode ? " hidden" : " visible"

    const [category,setCategory] = useState('')

    const updateCategory =(event:any) =>{
      const newCategory = event.target.value
      setCategory(newCategory)
    }

    const addNewCategory = () =>{
      props.addElement(category)
    }

    const removeCategory = (event:any) =>{
      const closestLi = event.target.closest('li')
      props.removeElement(closestLi.id.slice("editMode-list-item-".length))
    }

    return(
      <div className='text-center'>
        <p className=''>-- Categories --</p>
        
        <div className={showOnReadMode}>
          <ul className={'grid grid-cols-2 gap-1 items-center overflow-y-auto py-1 h-25'}>
            {
              props.stringList.map((word)=>{
                return (
                  <li 
                    className='text-sm hover:bg-blue-950' 
                    id={"list-item-" + word}
                    key={word}>
                    {word}
                  </li>
                )
              })
            }
          </ul>
        </div>
        
        <div className={showOnEditMode}>
          <ul className={'grid grid-cols-2 gap-1 items-center overflow-y-auto py-1 h-15 '}>
            {
              props.editedStringList.map((word)=>{
                return (
                  <li 
                    className='text-sm hover:bg-blue-950' 
                    id={"editMode-list-item-" + word}
                    key={word}>
                    <div className="flex flex-row justify-center gap-1 items-center">
                      <span>
                        {word}
                      </span>
                      <span>
                        <button 
                          className={" rounded px-1  hover:bg-red-950 "}
                          onClick={removeCategory}
                          type="button"
                          >( x )</button>
                      </span>
                    </div>
                    
                  </li>
                )
              })
            }
          </ul>
          <div className={'flex flex-row justify-center pt-1 '}>
            <div className="flex flex-col items-center">
                  <div className='flex flex-row gap-1 px-1'>
                      <input 
                        id='add-category-input' 
                        type="text" 
                        className=" bg-gray-700 rounded"
                        onChange={updateCategory}/>
                      <button 
                          className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                          onClick={addNewCategory}
                          type="button"
                      >+</button>
                  </div>
                
                <label className="text-sm" htmlFor='add-category-input'>add category</label>
            </div>
          </div>
        </div>

        
        
      </div>
    )
  }
  
  
  interface titleProps{
    title:string,
    date:string,
    editedTitle:string,
    editedDate:string,
    editMode:boolean,
    handleUpdateTitle:any,
    handleUpdateDate:any
  }
  const TitleArea = (props:titleProps) => {
    const showOnEditClass = props.editMode ? " visible" : " hidden"
    const showOnReadClass = props.editMode ? " hidden" : " visible"

    return (
      <div>
        <div className={'flex flex-row items-end justify-between px-5 py-2' + showOnReadClass}>
          <p className='text-xl' >{props.title}</p>
          <p className='text-sm'>{props.date}</p>
        </div>
        <div className={'flex flex-row items-end justify-between px-5 py-2' + showOnEditClass}>
            <input 
                type="text" 
                className='text-xl border rounded' 
                value={props.editedTitle}
                onChange={props.handleUpdateTitle}/>
            <input 
                type="text" 
                className='border rounded' 
                value={props.editedDate} 
                onChange={props.handleUpdateDate}/>
        </div>
        
      </div>
    )
  }
  
  interface stringProps{
    content:string,
    editedContent:string,
    editMode:boolean,
    handleUpdateContent:any
  }
  const ContentArea = (props:stringProps) => {
    const showOnReadClass = props.editMode ? " hidden" : " visible"
    const showOnEditClass = props.editMode ? " visible" : " hidden"
    return (
      <div className='h-83  overflow-auto py-2 px-2'>
        <p className={showOnReadClass}>{props.content}</p>
        <textarea 
            className={"block w-full h-full rounded border" + showOnEditClass} 
            value={props.editedContent} 
            onChange={props.handleUpdateContent}/>
      </div>
    )
  }








