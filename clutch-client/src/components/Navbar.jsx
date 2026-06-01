import React from "react";
import { Link, NavLink } from "react-router-dom";


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
            </section>
        </div>
        </>
    )
}

export default Navbar ;