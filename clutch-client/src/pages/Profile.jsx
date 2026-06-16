import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";

const Profile = () => {
  const { user } = useUser();
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/user/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDbUser(data);
          }
        })
        .catch(err => console.error("Error fetching db user details inside Profile:", err));
    }
  }, [user]);

  // Get user's full name or fallback
  const fullName = user ? user.fullName : "Ayush Chaudhary";
  
  // Get initials for avatar (e.g. "Ayush Chaudhary" -> "AC")
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };
  
  const initials = getInitials(fullName);

  return (
    <div className="min-h-screen bg-transparent text-white p-8 font-sans flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#12141C] p-8 rounded-[12px] border border-white/5 shadow-none flex flex-col items-center text-center gap-4">
        {/* Avatar */}
        {user && user.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={fullName} 
            className="w-24 h-24 rounded-[50%] object-cover border border-emerald-500/20 shadow-none"
          />
        ) : (
          <div className="w-24 h-24 bg-emerald-500/10 text-[#10B981] rounded-[50%] flex items-center justify-center text-3xl font-bold border border-emerald-500/20 shadow-none">
            {initials}
          </div>
        )}
        
        {/* Name & Title */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
          <p className="text-sm text-[#6B7280] mt-1">{dbUser?.collegeName || "Computer Science Student"}</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-[#6B7280] px-4 leading-relaxed">
          Passionate about problem-solving, DSA, and building web applications.
        </p>

        {/* Action Button */}
        <button className="mt-2 px-6 py-2 bg-[#10b981] hover:bg-[#059669] text-black text-sm font-semibold rounded-[8px] transition-colors border-0 shadow-none cursor-pointer">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;