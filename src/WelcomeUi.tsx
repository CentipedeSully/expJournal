import IconButton from "./uiComponents"


interface WelcomeProps{
    username:string,
    enterViewScreenHandler:any,
    enterWriteScreenHandler:any
}

const WelcomeUi = (props:WelcomeProps) => {








    return(
        <div className="flex flex-col justify-center items-center text-center h-screen">

            <GreetingText name={props.username}/>

            <div className="flex flex-col space-y-2 pt-20 pb-10">
                <IconButton 
                    label="Add Entry"
                    onClick={props.enterWriteScreenHandler}/>
                <IconButton 
                    label="View Collection"
                    onClick={props.enterViewScreenHandler}/>
            </div>


            <div className="flex justify-end">
                <Credit />
            </div>
            
        </div>
      )
}


export default WelcomeUi




interface greetingProps{
  name:string
}

const GreetingText = (props:greetingProps) => {
  

  return (
    <div className="">
      <h1 className="text-5xl text-gray-200">=== Exp Journal ===</h1>
    </div>
    
  )

}

const Credit = () => {

  return  (
    <p className="font-light">-------- Developed by CentiSully --------</p>
  )
}