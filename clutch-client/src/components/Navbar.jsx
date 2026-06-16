import React from "react";
import { NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {

    return (
        <>
            <div className="flex justify-between items-center p-4 bg-[#090A0F] border-b border-white/5 text-white">
                <section className="text-2xl font-bold tracking-tight text-white">
                    CLUTCH
                </section>
                <section className="flex gap-4 items-center">

                    <span>
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold" : "text-[#6B7280] hover:text-white transition-colors"}> Home</NavLink>
                    </span>


                    <span>
                        <NavLink to="/study-swap" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold" : "text-[#6B7280] hover:text-white transition-colors"}> Study Swap</NavLink>

                    </span>
                    <span>
                        <NavLink to="/study-room" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold" : "text-[#6B7280] hover:text-white transition-colors"}>Study Room</NavLink>
                    </span>
                    <span>
                        <NavLink to="/Campus-feed" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold" : "text-[#6B7280] hover:text-white transition-colors"}>  Campus Feed </NavLink>
                    </span>
                    <span>
                        <NavLink to="/profile" className={({ isActive }) => isActive ? "text-[#10B981] font-semibold" : "text-[#6B7280] hover:text-white transition-colors"}>Profile</NavLink>
                    </span>

                    {/* Sign In / Log Out Button Section */}
                    <span className="ml-4 flex items-center">
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode="modal" forceRedirectUrl="/onboarding">
                                <button className="bg-white hover:bg-[#e2e8f0] text-black px-4 py-1.5 rounded-[8px] font-semibold transition-colors border-0 shadow-none cursor-pointer">
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