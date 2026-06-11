import React from 'react';
import './index.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";





import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudySwap from './pages/StudySwap';
import StudyRoom from './pages/StudyRoom';
import Profile from './pages/Profile';
import Campusd from './pages/Campus-Feed';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import CollegeSelector from './api/College';
import CommentMain from './api/CommentsMain';

const App = () => {
  const [swaps, setSwaps] = useState(() => {
    const savedSwaps = localStorage.getItem("clutch_swaps");
    return savedSwaps ? JSON.parse(savedSwaps) : [];
  });

  useEffect(() => {
    localStorage.setItem("clutch_swaps", JSON.stringify(swaps));
  }, [swaps]);

  const addSwap = (newSwaps) => {
    setSwaps([...swaps, newSwaps]);
  };



  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home swaps={swaps} />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/onboarding' element={<CollegeSelector />} />
          <Route path='/study-swap' element={<StudySwap swaps={swaps} addSwap={addSwap} />} />
          <Route path='/study-room' element={<StudyRoom />} />
          <Route path='/campus-feed' element={<Campusd/>}/>
          <Route path='/profile' element ={<Profile/>}/>
          <Route path='/post/:postId' element={<CommentMain/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;