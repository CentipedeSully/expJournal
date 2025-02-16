import { createPortal } from "react-dom"
import { Entry } from "./entry"


const entryModalParent = document.getElementById('overlay-container')

const EntryOverlay = (props:SoloEntryModalProps) => {
    return(
        createPortal(
            <SoloEntryModal 
                showWindow={props.showWindow} 
                entryObj={props.entryObj}
                handleExit={props.handleExit}/>,
            entryModalParent
        )
        
    )

}

export default EntryOverlay


interface SoloEntryModalProps{
    showWindow:boolean,
    entryObj:Entry | null,
    handleExit:any
}
  
const SoloEntryModal = (props:SoloEntryModalProps)=>{
    const visibilityString = props.showWindow ? "visible " : "hidden"
    const className = "z-10 w-3/4 h-3/4 mx-auto absolute inset-x-0 rounded " + visibilityString

    return(
        <div className={className}>
            <div className="py-4 px-4 ">
                <div className=" border rounded bg-bluesteel">

                <HeaderArea handleBackClick={props.handleExit} handleEditClick={null}/>
                <hr />
                
                <form action="" >
                    <div className='grid grid-cols-2 py-3'>
                    <CategoriesArea stringList={["Gamedev","Webdev","Achievements"]} />
                    <KeywordsArea stringList={["physical","mental","social","emotional","financial"]} />
                    </div>
                    <hr />

                    <TitleArea title='text title' date='02/14/2025'/>
                    <ContentArea content='asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    
                    
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    
                    
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas
                    asdfasdf asdfasdfa asdfasdfasdf
                    asdfasdf asdfasdfas dfasdfasdfasdfasdfa adsfasf adsfa asdfasdfasdf
                    asdfa asdfasd fsdffsdfasf adfa afdsdfa fadsfadsfads fafdasffasdfas
                    asdfasdf dfadsf dfdsfa af f fadsf adfasdfasdf afd afdf f sfadsf absoluteas'
                    /> 
                </form>
                <hr />

                <FooterArea />
                </div>
            </div>
        </div>
    )
}



interface headerProps{
    handleBackClick:any,
    handleEditClick:any
}
const HeaderArea = (props:headerProps)=> {
    return(
      <div className='flex flex-row items-center justify-between py-5 px-5'>
        <button 
            className='rounded bg-blue-800 hover:bg-blue-950 px-2'
            onClick={props.handleBackClick}
            >Back
        </button>
        <button 
            className='rounded bg-blue-800 hover:bg-blue-950 px-2'
            onClick={props.handleEditClick}
            >Edit
        </button>
      </div>
    )
  }
  
  const FooterArea = ()=> {
    return(
      <div className='flex items-center justify-end py-5 px-5 '>
        <button className='rounded bg-blue-800 hover:bg-blue-950 px-2 '>Save</button>
      </div>
    )
  }
  
  interface stringListProps{
    stringList:string[]
  }
  
  const KeywordsArea = (props:stringListProps) => {
    return(
      <div className='text-center'>
        <p className=''>-- Keywords --</p>
        
        <ul className='grid grid-cols-2 text-center gap-1 py-2 h-15 overflow-y-auto'>
          {props.stringList.map((word)=>{
            return (
              <li className='text-sm hover:bg-blue-950' key={word}>{word}</li>
            )
          })}
        </ul>
        <div className='flex flex-row justify-center'>
          <div className="flex flex-col items-center">
              <div className='flex flex-row gap-1 px-1'>
                <input id='add-keyword-input' type="text" className=" bg-gray-700 rounded"/>
                <button 
                  className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                  >+</button>
              </div>
              
              <label className="text-sm" htmlFor='add-keyword-input'>add keyword</label>
          </div>
        </div>
      </div>
    )
  }
  
  const CategoriesArea = (props:stringListProps) => {
    return(
      <div className='text-center'>
        <p className=''>-- Categories --</p>
        
        <ul className='grid grid-cols-2 text-center gap-1 py-2 h-15 overflow-y-auto'>
          {props.stringList.map((word)=>{
            return (
              <li className='text-sm hover:bg-blue-950' key={word}>{word}</li>
            )
          })}
        </ul>
        <div className='flex flex-row justify-center'>
          <div className="flex flex-col items-center">
              <div className='flex flex-row gap-1 px-1'>
                <input id='add-category-input' type="text" className=" bg-gray-700 rounded"/>
                <button 
                  className='rounded bg-blue-800 hover:bg-blue-950 px-2 text-sm'
                  >+</button>
              </div>
              
              <label className="text-sm" htmlFor='add-category-input'>add category</label>
          </div>
        </div>
        
        
      </div>
    )
  }
  
  
  interface titleProps{
    title:string,
    date:string
  }
  const TitleArea = (props:titleProps) => {
    return (
      <div>
        <div className='flex flex-row items-end justify-between px-5 py-2'>
          <p className='text-xl' >{props.title}</p>
          <p className='text-sm'>{props.date}</p>
        </div>
        
      </div>
    )
  }
  
  interface stringProps{
    content:string
  }
  const ContentArea = (props:stringProps) => {
    return (
      <div className='h-83  overflow-auto py-2 px-2'>
        <p className=''>{props.content}</p>
      </div>
    )
  }








