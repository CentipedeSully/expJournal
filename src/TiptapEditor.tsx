// src/Tiptap.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'


interface tiptapProps{
    onChange:any
    originalContent:any
    editMode:boolean
}
const Tiptap = (props:tiptapProps) => {

    //Used to show/hide changes made to the document when toggling edit mode
    const [originalContent, setOriginalContent] = useState('')
    const [edits, setEdits] = useState("");
    const editor = useEditor({
      extensions: [StarterKit.configure({

        bulletList:{
            HTMLAttributes:{
                class: 'list-disc ml-5'
            }
        }

    })],
      onUpdate({ editor }) {
        const newHTML = editor.getHTML()
        if (edits !== newHTML){
            saveEdits()
        }
      },
       
    });
    
    //reset the editor to a newly-loaded entry
    useEffect(()=>{
        setOriginalContent(props.originalContent)
        setEdits(props.originalContent)
        editor.commands.setContent(props.originalContent)
    },[props.originalContent])

    //if the editmode changes, then 
    // either show the current changes made(active editmode) 
    // or show the unchanged document
    useEffect(()=>{
        props.editMode? editor.setEditable(true) : editor.setEditable(false)

        if (props.editMode){
            editor.commands.setContent(edits)
            saveEdits()
            
        }
        else {
            //change the content back to the original document
            editor.commands.setContent(originalContent)
        }
    },[props.editMode])

    //save any changes
    const saveEdits = ()=>{
        const newEdits = editor.getHTML()
        setEdits(newEdits)
        props.onChange(newEdits)
    }

    const activateBold = ()=>{
        if (editor.isEditable){
            editor.chain().toggleBold().run()
            saveEdits()
        }

    }

    const activateItalic = ()=>{
        if (editor.isEditable){
            editor.chain().toggleItalic().run()
            saveEdits()
        }
    }

    const activateStrike = ()=>{
        if (editor.isEditable){
            editor.chain().toggleStrike().run()
            saveEdits()
        }
    }

    const activateList = ()=>{
        if (editor.isEditable){
            editor.chain().toggleBulletList().run()
            saveEdits()
        }
    }
    return (
        <div className='rounded'>
            <div id='editor-menu' className='flex flex-row bg-gray-800 rounded-t'>
                <TiptapButton label='Bold' handleClick={activateBold} className={editor.isActive('bold') ? 'is-active' : ''}/>
                <TiptapButton label="Itaclic" handleClick={activateItalic} className={editor.isActive('italic') ? 'is-active' : ''}/>
                <TiptapButton label="Strike" handleClick={activateStrike} className={editor.isActive('strike') ? 'is-active' : ''}/>
                <TiptapButton label="Unordered List" handleClick={activateList} className={editor.isActive('bulletList') ? 'is-active' : ''}/>
                    
            </div>
            <div className='rounded-b'>
                <EditorContent editor={editor}/>
            </div>
            
        </div>
    )
}

export default Tiptap



interface tiptapButtonProps{
    label:string,
    handleClick:any,
    className:string
}

const TiptapButton = (props:tiptapButtonProps)=>{
    return (
        <div className='flex flex-row w-fit px-2 py-0.5 whitespace-nowrap text-sm rounded-t hover:bg-gray-600'>
            <button className={props.className}
                onClick={props.handleClick}>
                {props.label}
            </button>
        </div>
    )
}