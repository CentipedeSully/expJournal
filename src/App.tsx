import './App.css'

function App() {

  return (
    <>
      <Buttons />
      <GreetingText name="CentiSully"/>
      <Credit />
    </>
  )
}

export default App



const Buttons = () => {

  return null
}


interface greetingProps{
  name:string
}

const GreetingText = (props:greetingProps) => {
  

  return (
    <div>
      <h1>Welcome</h1>
      <h1>--= {props.name} =--</h1>
    </div>
    
  )

}

const Credit = () => {

  return  (
    <p>Developed by CentiSully</p>
  )
}
