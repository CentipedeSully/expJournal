interface ButtonProps{
    label:string,
    onClick:any
}

const AccentButton = (props:ButtonProps) =>{


    return (
        <div className="">
            <button 
                className="bg-rust text-white hover:bg-lightwheat hover:text-rust rounded-full py-2 px-5"
                onClick={props.onClick}>
                    {props.label}
            </button>
        </div>
    )
}

export const SmallButton = (props:ButtonProps) =>{


    return (
        <div className="">
            <button 
                className="bg-gray-400 text-bluesteel text-sm  hover:bg-white hover:text-zinc-900 rounded px-4"
                onClick={props.onClick}>
                    {props.label}
            </button>
        </div>
    )
}


interface InputProps{
    elementId:string,
    label:string,
    onChange:any
}

export const InputArea = (props:InputProps) => {
    return (
        <div className="flex flex-col items-center">
            <input 
                id={props.elementId} 
                type="text" 
                className=" bg-gray-700 rounded"
                onChange={props.onChange}
                />
            <label className="text-sm" htmlFor={props.elementId}>{props.label}</label>
        </div>
    )
}

export default AccentButton