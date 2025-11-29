import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import Footer from './components/layout/Footer'
import NavBar from './components/layout/NavBar'
// import PipePuzzle from './components/game/PipePuzzle'
function App() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}

export default App
