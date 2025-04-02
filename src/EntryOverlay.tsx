import { createPortal } from "react-dom"
import { Entry } from "./entry"
import { useState, useEffect } from "react"
import { NegativeSmallButton, PositiveSmallButton, SmallButton } from "./uiComponents"
import Tiptap from "./TiptapEditor"


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
  
  const [title,setTitle] = useState('')
  const [date,setDate] = useState('')
  const [content,setContent] = useState('')
  const [categories,setCategories] = useState([])
  const [keywords,setKeywords] = useState([])

  const [editMode, setEditmode] = useState(false)

  const showIfEditEnabled = editMode? " visible": " hidden"
  const showIfEditDisabled = editMode? " hidden": " visible"

  useEffect(()=>{
    setTitle(props.entryObj.title)
    setDate(props.entryObj.dateMMDDYYYY)
    setContent(props.entryObj.content)
    setCategories(props.entryObj.categories)
    setKeywords(props.entryObj.keywords)


  },[props.entryObj])



  const switchEditMode = ()=>{
    const currentMode = editMode;
    setEditmode(!currentMode)
  }


  const updateTitle = (event:any)=>{
    const newTitle = event.target.value
    setTitle(newTitle)
  }
  const updateDate = (event:any)=>{
    const newDate = event.target.value
    setDate(newDate)
  }

  const updateContentFromEditor = (html:any) => {
    const newContent = html
    //console.log("Received updated HTML(outside the editor, within the overlay):\n",html)
    setContent(newContent)

    //console.log("Updated html:",html)
  }
  const addKeyword= (word:string) => {
    if (!keywords.includes(word)){
      const newKeywords= keywords.concat(word)
      setKeywords(newKeywords)
    }
  }

  const removeKeyword= (word:string) =>{
    if (keywords.includes(word)){
      const newKeywords = keywords.filter((string)=> string!== word)
      setKeywords(newKeywords)
    }
  }

  const addCategory= (word:string) => {
    if (!categories.includes(word)){
      const newCategories= categories.concat(word)
      setCategories(newCategories)
    }
  }

  const removeCategory= (word:string) =>{
    if (categories.includes(word)){
      const newCategories = categories.filter((string)=> string!== word)
      setCategories(newCategories)
    }
  }


  const saveEntry = () =>{

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


  return(
    <div id="entry-modal" className={"z-10 w-3/4 mx-auto my-auto absolute  inset-x-0 rounded border bg-bluesteel" + visibilityString}>

      <form className=" lg:h-110 flex flex-col md:flex-row space-x-1 px-4 my-4" onSubmit={(event)=>{event.preventDefault()}}>

        <div id="modal-header-buttons-sm" className="visible md:hidden flex flex-row justify-center space-x-4 ">
          <SmallButton 
              label={"Back"}
              onClick={cleanUpAndExit}
          />
          <SmallButton 
              label={editMode? "Edit: On" : "Edit: Off"}
              onClick={switchEditMode}
          />
        </div>

        <div id="modal-side-area" className=" md:w-1/4 flex flex-row md:flex-col justify-evenly">

          <div id="modal-side-upper-half" className="flex flex-col h-full justify-between">
            <div id="modal-header-buttons-md" className="hidden md:visible md:flex md:flex-col lg:flex-row  md:justify-center space-x-4 ">
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

              <CategoriesArea 
                stringList={props.entryObj.categories}
                editedStringList={categories}
                editMode={editMode}
                addElement={addCategory}
                removeElement={removeCategory}
              />

            </div>
          </div>

          
          <div  id="modal-side-lower-half" className="flex flex-col h-full justify-between">
            <div id="keyword-tags-area" className="flex flex-col rounded">

                <KeywordsArea 
                  stringList={props.entryObj.keywords}
                  editedStringList={keywords}
                  editMode={editMode}
                  addElement={addKeyword}
                  removeElement={removeKeyword}/>

            </div>
            
            <div id="modal-footer-buttons-md">
              <div className={"hidden md:flex md:visible md:flex-col lg:flex-row md:justify-center space-x-4 " + showIfEditEnabled}>
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

        <div id="modal-footer-buttons-sm" className={"visible md:hidden flex flex-row justify-center space-x-4 " + showIfEditEnabled}>
          <PositiveSmallButton 
              label={"Save"}
              onClick={saveEntry}
          />
          <NegativeSmallButton 
              label={"Delete"}
              onClick={deleteEntry}
          />
        </div>


        <div id="modal-main-area" className="pt-5 md:pt-0 ml-2 rounded md:w-3/4">
          <div id="modal-header-area" className="flex flex-row justify-between space-x-2 mb-3">

            <p id="modal-original-title" className={"text-2xl overflow-x-auto whitespace-nowrap" + showIfEditDisabled}>{props.entryObj.title}</p>
            <input 
              id="modal-edited-title" 
              className={"text-2xl w-full rounded hover:bg-gray-800" + showIfEditEnabled}
              value={title}
              placeholder="New Title"
              onChange={updateTitle}/>

            <div className="flex">
              <p id="modal-original-date" className={"text-sm mt-3 " + showIfEditDisabled}>{props.entryObj.dateMMDDYYYY}</p>
              <input 
                id="modal-edited-date" 
                className={"text-sm mt-2 w-full text-end hover:bg-gray-800 rounded " + showIfEditEnabled}
                value={date}
                placeholder="MM/DD/YYYY"
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
      <div className='flex flex-col justify-between text-center h-40 rounded-b bg-gray-900 hover:bg-bluesteel hover:border'>
        <div>
          <p className='pt-1'>Keywords</p>

          <div className={"flex justify-center " + showOnReadMode}>
            <ul className={'flex-1 scroll h-25 overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5'}>
              {
                props.stringList.map((word)=>{
                  return (
                    <li 
                      className='rounded text-sm mx-auto hover:bg-amber-950 w-30  overflow-x-auto bg-gray-800 px-2 ' 
                      id={"list-item-" + word}
                      key={word}>
                      {word}
                    </li>
                  )
                })
              }
              <li className={props.stringList.length === 0? " visible" : " hidden"}>
                <div className="mt-10 rounded text-sm mx-auto hover:bg-amber-950 w-30  px-2 ">
                  -- None --
                </div>
              </li>
            </ul>
          </div>
          
          <div className={"flex justify-center " + showOnEditMode}>
            <ul className={'flex-1 scroll h-20 overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5'}>
              {
                props.editedStringList.map((word)=>{
                  return (
                    <li 
                      className='rounded text-sm mx-auto hover:bg-amber-950 w-30 bg-gray-800 px-2 ' 
                      id={"editMode-list-item-" + word}
                      key={word}>
                      <div className="flex flex-row justify-between gap-1 items-center">
                        <span className="overflow-x-auto w-full">
                          {word}
                        </span>
                        <span>
                          <button 
                            className={" rounded  hover:bg-red-800 "}
                            onClick={removeKeyword}
                            type="button"
                            >( x )</button>
                        </span>
                      </div>
                      
                    </li>
                  )
                })
              }
              <li className={props.editedStringList.length === 0? " visible" : " hidden"}>
                <div className="mt-5 rounded text-sm mx-auto hover:bg-amber-950 w-30  px-2 ">
                  -- None --
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={'flex flex-row justify-center pt-1 pb-3 mx-2'+ showOnEditMode}>
            <div className="flex flex-col items-center">
              <div className='flex flex-row gap-1 px-1'>
                <input 
                  id='add-keyword-input' 
                  type="text" 
                  className="text-center bg-gray-700 rounded w-full"
                  placeholder="New Keyword"
                  onChange={updateKeyword}/>
                <button 
                  className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                  onClick={addNewKeyword}
                  type="button"
                >+</button>
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
      <div className='flex flex-col justify-between text-center h-40 rounded-t bg-gray-900  hover:bg-bluesteel hover:border'>
        <div >
          <p className='pt-1'>Categories</p>
          
          <div className={"flex justify-center " + showOnReadMode}>
            <ul className={'flex-1 scroll h-25 overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5'}>
              {
                props.stringList.map((word)=>{
                  return (
                    <li 
                      className='rounded text-sm mx-auto hover:bg-amber-950 w-30  overflow-x-auto bg-gray-800 px-2 ' 
                      id={"list-item-" + word}
                      key={word}>
                      {word}
                    </li>
                  )
                })
              }
              <li className={props.stringList.length === 0? " visible" : " hidden"}>
                <div className="mt-10 rounded text-sm mx-auto hover:bg-amber-950 w-30  px-2 ">
                  -- None --
                </div>
              </li>
            </ul>
          </div>
          
          <div className={"flex justify-center " + showOnEditMode}>
            <ul className={'flex-1 scroll h-20 overflow-y-auto whitespace-nowrap space-y-1.5 pt-0.5'}>
              {
                props.editedStringList.map((word)=>{
                  return (
                    <li 
                      className='rounded text-sm mx-auto hover:bg-amber-950 w-30 bg-gray-800 px-2 ' 
                      id={"editMode-list-item-" + word}
                      key={word}>
                      <div className="flex flex-row justify-between gap-1 items-center">
                        <span className="overflow-x-auto w-full">
                          {word}
                        </span>
                        <span>
                          <button 
                            className={" rounded  hover:bg-red-800 "}
                            onClick={removeCategory}
                            type="button"
                            >( x )</button>
                        </span>
                      </div>
                    </li>
                  )
                })
              }
              <li className={props.editedStringList.length === 0? " visible" : " hidden"}>
                <div className="mt-5 rounded text-sm mx-auto hover:bg-amber-950 w-30  px-2 ">
                  -- None --
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className={'flex flex-row justify-center pt-1 pb-3 mx-2'+ showOnEditMode}>
          <div className="flex flex-col items-center">
                <div className='flex flex-row gap-1 px-1'>
                    <input 
                      id='add-category-input' 
                      type="text" 
                      className="text-center bg-gray-700 rounded w-full"
                      placeholder="New Category"
                      onChange={updateCategory}/>
                    <button 
                        className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                        onClick={addNewCategory}
                        type="button"
                    >+</button>
                </div>
          </div>
        </div>

        
        
      </div>
    )
  }









