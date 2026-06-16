import React from 'react';
import './index.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";





import Navbar from './components/Navbar';
import Home from './pages/Home';
import StudySwap from './pages/StudySwap';
import StudyRoom from './pages/StudyRoom';
import Profile from './pages/Profile';
import MatchPopup from './components/MatchPopup';
import Campusd from './pages/Campus-Feed';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import CollegeSelector from './api/College';
import CommentMain from './api/CommentsMain';

const App = () => {
  const [swaps, setSwaps] = useState([]);
  
  // Create a navigate wrapper component to use hooks
  return (
    <BrowserRouter>
      <AppContent swaps={swaps} setSwaps={setSwaps} />
    </BrowserRouter>
  );
};

const AppContent = ({ swaps, setSwaps }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user && user.id) {
      // Sync Clerk fullName to Prisma username automatically
      fetch("http://localhost:5000/api/sync-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerkId: user.id,
          // prefer Clerk `username` (handle) over full name so displays match Clerk handle
          username: user.username || user.fullName || user.firstName || "Clutch User"
        })
      }).catch(err => console.error("Sync user error:", err));
    }
  }, [user]);

  useEffect(() => {
    fetch("http://localhost:5000/api/swaps")
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          const formattedSwaps = data.map(swap => {
            const rawName = swap.user?.username || "Clutch User";
            const displayName = rawName.startsWith("user_") ? "Student" : rawName;
            
            return {
              id: swap.id,
              name: displayName,
              college: swap.user?.collegeName || "IIIT",
            year: "2nd",
            rating: "5.0⭐",
            offer: swap.offer,
            need: swap.need,
            urgency: swap.urgency,
            category: swap.category,
            userId: swap.user?.clerkId || swap.userId,
            socketId: swap.socketId || null, 
            };
          });
          setSwaps(formattedSwaps);
        }
      })
      .catch(err => console.error("Error fetching swaps:", err));
  }, []);

  const addSwap = (newSwap) => {
    setSwaps([newSwap, ...swaps]);
  };



  return (
    <>
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

      <MatchPopup />
    </>
  );
};

export default App;