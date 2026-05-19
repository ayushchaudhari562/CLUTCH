import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#121212] text-white p-8 font-sans flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#1e1e1e] p-8 rounded-2xl border border-neutral-800 shadow-xl flex flex-col items-center text-center gap-4">
        {/* Avatar */}
        <div className="w-24 h-24 bg-[#7c4dff] rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md">
          AC
        </div>
        
        {/* Name & Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ayush Chaudhary</h1>
          <p className="text-sm text-neutral-400 mt-1">Computer Science Student</p>
        </div>

        {/* Bio */}
        <p className="text-sm text-neutral-300 px-4 leading-relaxed">
          Passionate about problem-solving, DSA, and building web applications.
        </p>

        {/* Action Button */}
        <button className="mt-2 px-6 py-2 bg-[#7c4dff] hover:bg-[#6c3df0] text-white text-sm font-medium rounded-lg transition shadow">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;