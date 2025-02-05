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
                className="bg-blue-300 text-bluesteel  hover:bg-white hover:text-zinc-900 rounded-2xl px-4"
                onClick={props.onClick}>
                    {props.label}
            </button>
        </div>
    )
}


interface FilterProps{
    elementId:string,
    label:string
}

export const FilterInputArea = (props:FilterProps) => {
    return (
        <div className="flex flex-col items-center">
            <input id={props.elementId} type="text" className="bg-gray-700 rounded"/>
            <label htmlFor={props.elementId}>{props.label}</label>
        </div>
    )
}

export default AccentButton