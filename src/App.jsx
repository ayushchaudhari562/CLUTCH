import React from 'react';
import './index.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar  from './components/Navbar';
import Home from './pages/Home';
import StudySwap from './pages/StudySwap'
const App = ()=>{
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/study-swap' element={<StudySwap/>}/>

          
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;