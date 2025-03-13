import { createPortal } from "react-dom"
import { Entry } from "./entry"
import { useState, useEffect } from "react"
import { NegativeSmallButton, PositiveSmallButton, SmallButton } from "./uiComponents"
import Tiptap from "./TiptapEditor"
import { useCurrentEditor } from "@tiptap/react"
import Editor from "./Editor"


const entryModalParent = document.getElementById('overlay-container')

const EntryOverlay = (props:SoloEntryModalProps) => {
    return(
        createPortal(
            <SoloEntryModal 
                showWindow={props.showWindow} 
                entryObj={props.entryObj}
                handleExit={props.handleExit}
                handleSaveEntry={props.handleSaveEntry}
                handleDeleteEntry={props.handleDeleteEntry}
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
    handleSaveEntry:any,
    handleDeleteEntry:any
}
  
const SoloEntryModal = (props:SoloEntryModalProps)=>{

  const visibilityString = props.showWindow ? " visible " : " hidden "
  

  const [originEntry,setOriginEntry] = useState(props.entryObj)
  const [title,setTitle] = useState('')
  const [date,setDate] = useState('')
  const [content,setContent] = useState('')
  const [categories,setCategories] = useState([])
  const [keywords,setKeywords] = useState([])

  const [changeDetected, setChangeDetected] = useState(false)

  const [editMode, setEditmode] = useState(false)

  const showIfEditEnabled = editMode? " visible": " hidden"
  const showIfEditDisabled = editMode? " hidden": " visible"

  useEffect(()=>{
    setOriginEntry(props.entryObj)
    setTitle(props.entryObj.title)
    setDate(props.entryObj.dateMMDDYYYY)
    setContent(props.entryObj.content)
    setCategories(props.entryObj.categories)
    setKeywords(props.entryObj.keywords)


  },[props.entryObj])


  const detectChange = ()=>{
    setChangeDetected(true)
  }
  const clearDetectedChanges = ()=>{
    setChangeDetected(false)
  }

  const switchEditMode = ()=>{
    const currentMode = editMode;
    setEditmode(!currentMode)
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

  const updateContentFromEditor = (html:any) => {
    const newContent = html
    console.log("Received updated HTML(outside the editor, within the overlay):\n",html)
    setContent(newContent)
    detectChange()

    //console.log("Updated html:",html)
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
      _id:props.entryObj._id
    }
    console.log("Saving Entry to DB with below content:\n",updatedEntry.content)
    props.handleSaveEntry(updatedEntry)
    cleanUpAndExit()
  }

  const deleteEntry= () =>{
    props.handleDeleteEntry(props.entryObj._id)
    cleanUpAndExit()
  }

  const cleanUpAndExit = () =>{
    setEditmode(false)
    props.handleExit()
  }

  const createBigString = (sample:string, amount:number):string=>{
    if (amount <= 1)
      return sample
    else return (sample + createBigString(sample, amount - 1))
  }

  return(
    <div id="entry-modal" className={"z-10 w-3/4 mx-auto my-auto absolute  inset-x-0 rounded border bg-bluesteel" + visibilityString}>

      <form className="h-110 flex flex-row space-x-1 px-4 my-4" onSubmit={(event)=>{event.preventDefault()}}>
        <div id="modal-side-area" className=" w-1/4 flex flex-col justify-evenly">

          <div id="modal-side-upper-half" className="flex flex-col h-full justify-between">
            <div id="modal-header-buttons" className="flex sm:flex-col  md:flex-col lg:flex-row lx:flex-row  justify-center space-x-4 ">
              <SmallButton 
                  label={"Back"}
                  onClick={cleanUpAndExit}
              />
              <SmallButton 
                  label={editMode? "Edit: On" : "Edit: Off"}
                  onClick={switchEditMode}
              />
            </div>

            <div id="category-tags-area" className="flex flex-col rounded">

              <p className="text-center">Categories</p>

              <div className="flex justify-center">
                <ul className={"h-30 rounded overflow-auto whitespace-nowrap space-y-1.5 pt-0.5 "}>
                { props.entryObj.categories.map((word)=>{ 

                  const elementId = 'category-tag-' + word
                  return(

                      <li 
                          className='rounded text-sm hover:bg-amber-950 w-30  overflow-x-auto bg-gray-800 px-2'
                          key={word}
                          id={elementId}>
                          <div className="text-center overflow-x-auto">
                            {word}
                          </div>
                      </li>
                  )})}
                </ul>
              </div>

            </div>
          </div>

          
          <div  id="modal-side-lower-half" className="flex flex-col h-full justify-between">
            <div id="keyword-tags-area" className="flex flex-col rounded">

              <p className="text-center">Keywords</p>

              <div className="flex justify-center">
                <ul className={"flex flex-col h-30 overflow-auto whitespace-nowrap space-y-1.5 pt-0.5"}>
                { props.entryObj.keywords.map((word)=>{ 

                  const elementId = 'keyword-tag-' + word
                  return(

                      <li 
                          className='rounded text-sm hover:bg-amber-950 w-30  overflow-x-auto bg-gray-800 px-2 '
                          key={word}
                          id={elementId}>
                          <div className="text-center overflow-x-auto">
                            {word}
                          </div>
                      </li>
                  )})}
                </ul>
              </div>

            </div>
            
            <div id="modal-footer-buttons">
              <div className={"flex sm:flex-col-reverse  md:flex-col lg:flex-row lx:flex-row justify-center space-x-4 " + showIfEditEnabled}>
                <PositiveSmallButton 
                    label={"Save"}
                    onClick={saveEntry}
                />
                <NegativeSmallButton 
                    label={"Delete"}
                    onClick={deleteEntry}
                />
              </div>
            </div>
            
          </div>
              
        </div>


        <div id="modal-main-area" className=" ml-2 rounded w-3/4">
          <div id="modal-header-area" className="flex flex-row justify-between space-x-2 mb-3">

            <p id="modal-original-title" className={"text-2xl overflow-x-auto whitespace-nowrap" + showIfEditDisabled}>{props.entryObj.title}</p>
            <input id="modal-edited-title" className={"text-2xl w-full rounded hover:bg-gray-800" + showIfEditEnabled}
              value={title}
              onChange={updateTitle}/>

            <div className="flex">
              <p id="modal-original-date" className={"text-sm mt-3 " + showIfEditDisabled}>{props.entryObj.dateMMDDYYYY}</p>
              <input id="modal-edited-date" className={"text-sm mt-2 w-full text-end hover:bg-gray-800 rounded " + showIfEditEnabled}
              value={date}
              onChange={updateDate}/>
            </div>

          </div>
          <div id="modal-body-area" className="">
            <div id="modal-editor" className="">
              <Tiptap 
                onChange={updateContentFromEditor}
                originalContent={props.entryObj.content}
                editMode={editMode}/>
            </div>
          </div>
        </div>
          
      </form>
    </div>
  )
}

/*
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
      stringList={originEntry.categories}
      editMode={props.editMode}
      addElement={addCategory}
      removeElement={removeCategory}
    />
    
    <KeywordsArea 
      editedStringList={keywords}
      stringList={originEntry.keywords}
      editMode={props.editMode} 
      addElement={addKeyword}
      removeElement={removeKeyword}
    />
  </div>
  <hr />
  <div className="">
    <TitleArea 
      editedTitle={title} 
      editedDate={date}
      title={originEntry.title}
      date={originEntry.dateMMDDYYYY}
      editMode={props.editMode}
      handleUpdateTitle={updateTitle}
      handleUpdateDate={updateDate}
    />
    <ContentArea 
      content={originEntry.content}
      editedContent={content}
      editMode={props.editMode}
      handleUpdateContent={updateContent}
    /> 
  </div>
  
</form>
<hr />

<FooterArea 
  unsavedChangesDetected={changeDetected}
  handleSave={saveEntry}
  handleDelete={deleteEntry}
/>
*/


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
    handleSave:any,
    handleDelete:any
  }
  const FooterArea = (props:footerProps)=> {

    return(
      <div className={'flex items-center justify-between py-5 px-5 '}>
        <button 
            className={'rounded bg-amber-900 hover:bg-amber-950 px-2 '}
            onClick={props.handleDelete}>
            Delete
        </button>
        <button 
            className={'rounded bg-blue-800 hover:bg-blue-950 px-2 '}
            onClick={props.handleSave}>
            {props.unsavedChangesDetected ? "Save" : "Saved"}
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
      <div className='text-center border-r'>
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
                className='text-xl border rounded text-center' 
                value={props.editedTitle}
                placeholder="Title"
                onChange={props.handleUpdateTitle}/>
            <input 
                type="text" 
                className='border rounded text-center' 
                value={props.editedDate} 
                placeholder="MM/DD/YYYY"
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

    const showOnReadClass = props.editMode? " hidden" : " visible"
    const showOnEditClass = props.editMode? " visible" : " hidden"

    return (
      <div id="editor" className='overflow-auto py-2 px-2 '>
        <p className={showOnReadClass}>{props.content}</p>
        <textarea 
            className={"block w-full h-full rounded border px-2" + showOnEditClass} 
            value={props.editedContent} 
            onChange={props.handleUpdateContent}/>
      </div>
    )
  }








