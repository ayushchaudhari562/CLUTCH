import React from "react";
import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {

    return(
        <>
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <section className="text-2xl font-bold">
                CLUTCH
            </section>
            <section className="flex gap-4">
              
                    <span>
                         <NavLink to="/" className={({ isActive }) => isActive ? "text-blue-400" : ""}> Home</NavLink>
                    </span>
               
                
                <span>
                    <NavLink to="/study-swap" className={({ isActive }) => isActive ? "text-blue-400" : ""}> Study Swap</NavLink>
                   
                </span>
                <span>
                    <NavLink to="/study-room" className={({ isActive }) => isActive ? "text-blue-400" : ""}>Study Room</NavLink>
                </span>
                <span>
                    <NavLink to="/Campus-feed" className={({ isActive }) => isActive ? "text-blue-400" : ""}>  Campus Feed </NavLink>
                </span>
                <span>
                    <NavLink to="/profile" className={({ isActive }) => isActive ? "text-blue-400" : ""}>Profile</NavLink>
                </span>
                
                {/* Sign In / Log Out Button Section */}
                <span className="ml-4 flex items-center">
                    <SignedIn>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded font-bold transition-colors">
                                Sign In / Up
                            </button>
                        </SignInButton>
                    </SignedOut>
                </span>
            </section>
        </div>
        </>
    )
}

export default Navbar ;