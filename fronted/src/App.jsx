import { Outlet } from 'react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css'

function App() {


  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
