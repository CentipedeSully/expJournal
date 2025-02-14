import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createPortal } from 'react-dom'
import { Entry } from './entry.tsx'
import { InputArea } from './uiComponents.tsx'




interface SoloEntryModalProps{
  showWindow:boolean,
  entryObj:Entry | null
}

const SoloEntryModal = (props:SoloEntryModalProps)=>{

  const visibilityString = props.showWindow ? "visible " : "hidden"
  const className = "border bg-bluesteel w-3/4 h-3/4 mx-auto absolute inset-x-0 rounded " + visibilityString

  return(
    <div className={className}>
      <div className="py-4 px-4">
        <div className=" border rounded">

          <HeaderArea/>
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


const root = document.getElementById('root')

if (root){
  createRoot(root).render(
    <StrictMode>
      <App />
      {createPortal(
        <SoloEntryModal 
          showWindow={true} 
          entryObj={null}
        />,
        root
      )}
    </StrictMode>,

  )
}




const HeaderArea = ()=> {
  return(
    <div className='flex flex-row items-center justify-between py-5 px-5'>
      <button className='rounded bg-blue-800 hover:bg-blue-950 px-2'>Back</button>
      <button className='rounded bg-blue-800 hover:bg-blue-950 px-2'>Edit</button>
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
      
      <ul className='grid grid-cols-2 text-center gap-1 py-2'>
        {props.stringList.map((word)=>{
          return (
            <li className='text-sm hover:bg-blue-950' key={word}>{word}</li>
          )
        })}
      </ul>

      <InputArea elementId="solo-keyword-input" label="add keyword"/>
    </div>
  )
}

const CategoriesArea = (props:stringListProps) => {
  return(
    <div className='text-center'>
      <p className=''>-- Categories --</p>
      
      <ul className='grid grid-cols-2 text-center gap-1 py-2'>
        {props.stringList.map((word)=>{
          return (
            <li className='text-sm hover:bg-blue-950' key={word}>{word}</li>
          )
        })}
      </ul>
      <InputArea elementId="solo-category-input" label="add category"/>
      
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
    <div className='max-h-83  overflow-auto py-2 px-2'>
      <p className=''>{props.content}</p>
    </div>
  )
}


  
