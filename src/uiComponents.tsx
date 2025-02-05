interface IconButtonProps{
    label:string,
    onClick:any
}

const IconButton = (props:IconButtonProps) =>{

    const highlightLabel = () => {
        
    }




    return (
        <div className="flex flex-col items-center">
            <button 
                className="bg-rust text-white hover:bg-lightwheat hover:text-rust rounded-full py-2 px-5"
                onClick={props.onClick}>
                    {props.label}
            </button>
        </div>
    )
}

export default IconButton