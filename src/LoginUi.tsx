import { useState } from "react"



interface loginProps{
    enterViewScreenHandler:any
    handleSignInSubmit:any
    signInErr:string
}

const LoginUi = (props:loginProps) => {


const [user, setUser] = useState("")
const [password, setPassword] = useState("")

const showErrIfNotEmpty = props.signInErr.length > 0 ? " visible px-3" : " hidden"


const updateUsername = (event:any) => {
  const newUser = event.target.value
  setUser(newUser)
}

const updatePassword = (event:any) => {
  const newPassword = event.target.value
  setPassword(newPassword)
}

const enterViewScreenAsGuest = () =>{
  props.enterViewScreenHandler("Guest")
}

const handleSubmit = async (e:any) => {
  e.preventDefault();
  props.handleSignInSubmit(user,password)
  
  
}


    return(
        <div className="flex flex-col justify-center items-center text-center h-screen">

            <Heading />

            <div className="flex flex-col space-y-2 pt-20 pb-10">
              <button 
                className='rounded mx-auto hover:bg-amber-950 hover:text-yellow-400 text-2xl whitespace-nowrap overflow-x-auto bg-amber-800 px-4 py-2 text-gray-300'
                onClick={enterViewScreenAsGuest}>
                {"View as Guest"}

              </button>

              <p>---- or ----</p>
              
              
              <form 
                className="flex flex-col mx-auto justify-evenly space-y-1"
                onSubmit={(e)=>{e.preventDefault()}}>
                <input 
                  id='auth-user' 
                  type="text" 
                  className="text-center bg-gray-700 w-50 rounded"
                  placeholder="User"
                  onChange={updateUsername}/>

                <input 
                  id='auth-password' 
                  type="text" 
                  className="text-center bg-gray-700 w-50 rounded"
                  placeholder="Password"
                  onChange={updatePassword}/>

                <button 
                  className='rounded text-sm mx-auto hover:bg-amber-950 w-30  overflow-x-auto bg-gray-800 px-2 '
                  onClick={handleSubmit}>
                  {"Sign In"}
                </button>
              </form>

              <div className={"mt-3 rounded max-w-80 border border-red-800 hover:bg-red-950 " + showErrIfNotEmpty}>{props.signInErr}</div>


            </div>


            <div className="flex justify-end">
                <Credit />
            </div>
            
        </div>
      )
}


export default LoginUi





const Heading = () => {
  

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