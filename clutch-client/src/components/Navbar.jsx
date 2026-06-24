import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isStudyRoom = location.pathname === "/study-room";

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-3 bg-surface border-b border-white/5 text-white shadow-lg transition-transform duration-300 ${isStudyRoom ? "-translate-y-full" : "translate-y-0"}`}>
        <section className="flex items-center gap-3">
          <div className="flex items-center select-none cursor-pointer" onClick={() => navigate("/")}>
            <svg className="h-9 w-auto shrink-0" viewBox="0 0 130 45" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logo-c-gradient" x1="0.8" y1="0.1" x2="0.2" y2="0.9">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="30%" stopColor="#EA4335" />
                  <stop offset="65%" stopColor="#FBBC05" />
                  <stop offset="100%" stopColor="#34A853" />
                </linearGradient>
              </defs>

              {/* Logo Icon C (Acts as the first letter 'C' in CLUTCH) */}
              {/* Outer C shape */}
              <path d="M 32.4 12.6 A 14 14 0 1 0 32.4 32.4" stroke="url(#logo-c-gradient)" strokeWidth="8.5" strokeLinecap="butt" fill="none" />

              {/* Student 1 (Left) */}
              <circle cx="19.5" cy="18.5" r="1.8" fill="#FFFFFF" />
              <path d="M 15.5 24 C 15.5 21, 21.5 21, 21.5 24 Z" fill="#FFFFFF" />

              {/* Student 2 (Right) */}
              <circle cx="25.5" cy="18.5" r="1.8" fill="#FFFFFF" />
              <path d="M 23.5 24 C 23.5 21, 29.5 21, 29.5 24 Z" fill="#FFFFFF" />

              {/* Open Book */}
              <path d="M 15 26.2 C 18 24.7, 21 24.7, 22.2 27.2 C 20 26.4, 17 26.4, 15 26.2 Z" fill="#FFFFFF" />
              <path d="M 30 26.2 C 27 24.7, 24 24.7, 22.8 27.2 C 25 26.4, 28 26.4, 30 26.2 Z" fill="#FFFFFF" />

              {/* Text: LUTCH */}
              {/* L */}
              <path d="M 46.5 10 L 46.5 25.5 L 53 25.5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              {/* U */}
              <path d="M 60.2 10 L 60.2 21.5 A 4 4 0 0 0 68.2 21.5 L 68.2 10" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              {/* T */}
              <path d="M 75.4 10 L 83.4 10 M 79.4 10 L 79.4 25.5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              {/* C */}
              <path d="M 103.6 12 A 6.5 6.5 0 1 0 103.6 25" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              {/* H */}
              <path d="M 110.8 10 L 110.8 25.5" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              <path d="M 110.8 18 L 118.8 18" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              <path d="M 118.8 10 L 118.8 18" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="butt" fill="none" />
              {/* Green box replacement for bottom right H leg */}
              <rect x="117.2" y="18" width="3.2" height="7.5" fill="#34A853" rx="0.5" />

              {/* Tagline */}
              <text x="46.5" y="38" fontSize="5.2" fontWeight="900" fontFamily="'Plus Jakarta Sans', system-ui, sans-serif" letterSpacing="1.1">
                <tspan fill="#4285F4">LEARN.</tspan>
                <tspan fill="#FBBC05"> COLLABORATE.</tspan>
                <tspan fill="#34A853"> GROW.</tspan>
              </text>
            </svg>
          </div>

          <span className="bg-google-green/10 text-google-green border border-google-green/20 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-widest select-none">
            Beta
          </span>
        </section>

        <section className="flex gap-2 items-center">
          <span>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-google-blue font-semibold px-4 py-1.5 text-sm transition-all duration-200"
                  : "text-slate-400 hover:text-white px-4 py-1.5 text-sm transition-all duration-200"
              }
            >
              Home
            </NavLink>
          </span>

          <span>
            <NavLink
              to="/study-swap"
              className={({ isActive }) =>
                isActive
                  ? "text-google-blue font-semibold px-4 py-1.5 text-sm transition-all duration-200"
                  : "text-slate-400 hover:text-white px-4 py-1.5 text-sm transition-all duration-200"
              }
            >
              Study Swap
            </NavLink>
          </span>

          <span>
            <NavLink
              to="/study-room"
              className={({ isActive }) =>
                isActive
                  ? "text-google-blue font-semibold px-4 py-1.5 text-sm transition-all duration-200"
                  : "text-slate-400 hover:text-white px-4 py-1.5 text-sm transition-all duration-200"
              }
            >
              Study Room
            </NavLink>
          </span>

          <span>
            <NavLink
              to="/Campus-feed"
              className={({ isActive }) =>
                isActive
                  ? "text-google-blue font-semibold px-4 py-1.5 text-sm transition-all duration-200"
                  : "text-slate-400 hover:text-white px-4 py-1.5 text-sm transition-all duration-200"
              }
            >
              Campus Feed
            </NavLink>
          </span>

          <span>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive
                  ? "text-google-blue font-semibold px-4 py-1.5 text-sm transition-all duration-200"
                  : "text-slate-400 hover:text-white px-4 py-1.5 text-sm transition-all duration-200"
              }
            >
              Profile
            </NavLink>
          </span>

          {/* Sign In / Log Out Button Section */}
          <span className="ml-3 flex items-center">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/onboarding">
                <button className="bg-google-blue hover:bg-google-blue/90 text-white px-5 py-2 rounded-full font-semibold transition-colors border-0 shadow-md cursor-pointer text-sm">
                  Sign In / Up
                </button>
              </SignInButton>
            </SignedOut>
          </span>
        </section>
      </div>
    </>
  );
};

export default Navbar;