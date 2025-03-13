// src/Tiptap.tsx
import { useEditor, FloatingMenu, BubbleMenu, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

// define your extension array
const extensions = [
    StarterKit
    ]

const content = '<p>Hello World!</p>'


interface tiptapProps{
    onChange:any
    content:any
}
const Tiptap = (props:tiptapProps) => {

    const editor = useEditor({
        extensions,
        content,
    })

    useEffect(()=>{
        editor.commands.setContent(props.content)
    },[props.content])

    editor.on('update', ({editor}) =>{
        console.log("change occured in editor")
        props.onChange(editor.getHTML())
    })

    const activateBold = ()=>{
        editor.chain().toggleBold().run()
    }

    const activateItalic = ()=>{
        editor.chain().toggleItalic().run()
    }


    return (
        <div className='rounded'>
            <div id='editor-menu' className='flex flex-row bg-gray-800 rounded-t'>
                <TiptapButton label='Bold' handleClick={activateBold} className={editor.isActive('bold') ? 'is-active' : ''}/>
                <TiptapButton label="Itaclic" handleClick={activateItalic} className={editor.isActive('italic') ? 'is-active' : ''}/>
                    
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