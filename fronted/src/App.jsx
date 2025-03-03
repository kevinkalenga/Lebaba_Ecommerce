import { Outlet } from 'react-router'
import './App.css'

function App() {


  return (
    <>
      <h1 className="bg-red-600 my-0 text-center p-5 text-white font-bold">
        Hello World
      </h1>
      <Outlet />
    </>
  )
}

export default App
