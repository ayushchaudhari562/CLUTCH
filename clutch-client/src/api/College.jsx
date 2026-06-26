import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";


const CollegeSelector = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    // ...
    // search variable mein hum wo store karte hain jo user type karta hai
    // ...
    const [search, setSearch] = useState("");

    // ...
    // allColleges mein hum database se aayi hui colleges ki list store karte hain
    // ...
    const [allColleges, setAllColleges] = useState([]);

    // ...
    // isLoading se hum 'Loading...' message dikhate hain jab backend se data aa raha ho
    // ...
    const [isLoading, setIsLoading] = useState(false);

    // ...
    // useEffect tab run hota hai jab bhi 'search' variable change hota hai (yaani jab user kuch type karta hai)
    // ...

    useEffect(() => {
        setIsLoading(true);

        // ...
        // Step 1: Hum apne Express backend ko bol rahe hain: "Bhai, jo search query hai uske matching colleges de do"
        // ...
        fetch(`${import.meta.env.VITE_API_URL}/api/colleges?search=${search}`)
            .then(res => res.json())
            .then(data => {
                // ...
                // Step 2: Backend ne Prisma se colleges dhoondh kar yahan 'data' mein bhej diye hain
                // ...
                setAllColleges(data); // List update ho gayi
                setIsLoading(false); // Loading message hata do
            })
            .catch(err => {
                console.error("Error fetching colleges from backend:", err);
                setIsLoading(false);
            });
    }, [search]);

    const handleSelectCollege = async (collegeName) => {
        if (!user) return; // Agar user logged in nahi hai, to aage mat badho
        
        // ...
        // Step 3: Jab user kisi college par click kare, to usko database mein save karo
        // ...
        await fetch(import.meta.env.VITE_API_URL + "/api/save-college", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                clerkId: user.id, // User ki unique ID bhej rahe hain
                collegeName: collegeName, // Selected college ka naam bhej rahe hain
                collegeId: allColleges.find(c => c.name === collegeName)?.id, //collegeId bhi bhej rahe hain! this is very imp
                username: user.fullName || user.username || user.firstName || "Clutch User"
            })
        });


        // ...
        // Step 4: Jab college save ho jaye, to user ko Campus Feed wale page par bhej do!
        //abhi cf pr hi krunga 
        // ...
        navigate("/campus-feed");
    };

    return(
        <div className="p-8 max-w-lg mx-auto mt-24 bg-surface rounded-[16px] border border-white/5 text-white shadow-md font-sans">
            <h1 className="text-lg font-extrabold text-white mb-4">Which college do you attend?</h1>
            
            <input 
                type="text" 
                placeholder="Search College..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full bg-background text-white placeholder-slate-500 border border-white/5 rounded-full px-4 py-2.5 mb-4 focus:outline-none focus:border-google-blue transition-colors text-xs"
            />

            {isLoading && <p className="text-slate-500 mb-2 text-xs font-bold">Searching database...</p>}

            <ul className="bg-background border border-white/5 rounded-[12px] overflow-hidden max-h-80 overflow-y-auto text-white list-none p-0 m-0 scrollbar-thin">
                {allColleges.map((college) => (
                    <li 
                        key={college.id} 
                        onClick={() => handleSelectCollege(college.name)}
                        className="p-3 border-b border-white/5 hover:bg-white/5 cursor-pointer flex items-center justify-between text-xs transition-colors duration-150"
                    >
                        <span className="text-slate-300 font-bold">{college.name}</span>
                        <span className="text-[9px] text-slate-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">Code: {college.id}</span>
                    </li>
                ))}
                
                {allColleges.length === 0 && !isLoading && (
                    <li className="p-3 text-slate-500 text-xs font-bold">No colleges found.</li>
                )}
            </ul>
        </div>
    )
}

export default CollegeSelector;