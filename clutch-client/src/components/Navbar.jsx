import React from "react";
import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {

    return (
        <>
            <div className="flex justify-between items-center p-3 md:p-4 bg-[#0F1114]/50 backdrop-blur-sm border-b border-white/5 text-white shadow-sm">
                <section className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#9CA3AF] to-[#10B981]">
                    CLUTCH
                </section>
                <section className="flex gap-3 md:gap-4 items-center">

                    <span>
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold px-2 py-1 rounded-md" : "text-[#6B7280] hover:text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors"}> Home</NavLink>
                    </span>


                    <span>
                        <NavLink to="/study-swap" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold px-2 py-1 rounded-md" : "text-[#6B7280] hover:text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors"}> Study Swap</NavLink>

                    </span>
                    <span>
                        <NavLink to="/study-room" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold px-2 py-1 rounded-md" : "text-[#6B7280] hover:text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors"}>Study Room</NavLink>
                    </span>
                    <span>
                        <NavLink to="/Campus-feed" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold px-2 py-1 rounded-md" : "text-[#6B7280] hover:text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors"}>  Campus Feed </NavLink>
                    </span>
                    <span>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold px-2 py-1 rounded-md" : "text-[#6B7280] hover:text-white hover:bg-white/5 px-2 py-1 rounded-md transition-colors"}>Profile</NavLink>
                    </span>

                    {/* Sign In / Log Out Button Section */}
                    <span className="ml-3 md:ml-4 flex items-center">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/onboarding">
                                <button className="bg-white hover:bg-[#f3f4f6] text-black px-3 py-1 rounded-[8px] font-semibold transition-colors border-0 shadow-sm cursor-pointer">
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

export default Navbar;