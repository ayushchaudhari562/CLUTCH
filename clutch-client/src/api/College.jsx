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
        fetch(`http://localhost:5000/api/colleges?search=${search}`)
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
    }, [search]); // <--- Ye array React ko batata hai ki sirf tab run karo jab 'search' change ho

    const handleSelectCollege = async (collegeName) => {
        if (!user) return; // Agar user logged in nahi hai, to aage mat badho
        
        // ...
        // Step 3: Jab user kisi college par click kare, to usko database mein save karo
        // ...
        await fetch("http://localhost:5000/api/save-college", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                clerkId: user.id, // User ki unique ID bhej rahe hain
                collegeName: collegeName, // Selected college ka naam bhej rahe hain
                collegeId: allColleges.find(c => c.name === collegeName)?.id // collegeId bhi bhej rahe hain! this is very imp
                
            })
        });

        // ...
        // Step 4: Jab college save ho jaye, to user ko Campus Feed wale page par bhej do!
        // ...
        navigate("/campus-feed");
    };

    return(
        <div className="p-8 max-w-lg mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Which college do you attend?</h1>
            
            <input 
                type="text" 
                placeholder="Search College..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="w-full p-2 border rounded mb-4 text-black"
            />

            {isLoading && <p className="text-gray-500 mb-2">Searching database...</p>}

            <ul className="bg-white shadow rounded overflow-hidden max-h-80 overflow-y-auto text-black">
                {allColleges.map((college) => (
                    <li 
                        key={college.id} 
                        onClick={() => handleSelectCollege(college.name)}
                        className="p-3 border-b hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                    >
                        <span>{college.name}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">Code: {college.id}</span>
                    </li>
                ))}
                
                {allColleges.length === 0 && !isLoading && (
                    <li className="p-3 text-gray-500">No colleges found.</li>
                )}
            </ul>
        </div>
    )
}

export default CollegeSelector;