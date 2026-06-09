import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const CollegeSelector = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    
    const [search, setSearch] = useState("");
    const [allColleges, setAllColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ==========================================
    // DEBUGGING LESSON: WHY THE SCREEN WAS BLANK
    // ==========================================
    // 1. Vite parsing error: We initially named this file 'College.js'. Vite requires files with HTML/JSX to be named '.jsx', so it threw a parse error.
    // 2. React Runtime Crash: The 'indian-colleges' package's function was called 'getAllColleges()', not 'getColleges()'. Calling a non-existent function crashed React.
    // 3. Array Format Crash: We tried to use `college.name.toLowerCase()`, but the package returned an array of Strings, not Objects. Calling `.name` on a string returns undefined, which crashed the app.
    // 4. Vite Silent Hang (Blank Screen): The 'indian-colleges' NPM package imports a massive 8MB JSON file synchronously. When Vite tried to bundle it, it silently choked and halted execution in the browser.
    // 
    // THE FIX: We uninstalled the NPM package and placed 'colleges.json' in the 'public' folder. 
    // Now, we use a `useEffect` to fetch the data asynchronously. This takes the load off the Vite compiler and stops the browser from freezing!
    useEffect(() => {
        fetch('/colleges.json')
            .then(res => res.json())
            .then(data => {
                const collegeNames = data.map(item => item.college);
                setAllColleges(collegeNames);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading colleges:", err);
                setIsLoading(false);
            });
    }, []);

    // Filter the fetched colleges based on the search bar input.
    // Notice how we use `typeof college === 'string'` as a safety check so that bad data doesn't crash the loop.
    const filteredColleges = allColleges.filter(college => 
        college && typeof college === 'string' && college.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);  

    const handleSelectCollege = async (collegeName) => {
        if (!user) return;
        
        // Save the chosen college into the PostgreSQL Database (Prisma) using our custom Express route
        await fetch("http://localhost:5000/api/save-college", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                clerkId: user.id,
                collegeName: collegeName 
            })
        });

        // Redirect the user to the Campus Feed after successfully onboarding
        navigate("/campus-feed");
    };

    return(
        <div className="p-8 max-w-lg mx-auto mt-20">
            <h1 className="text-2xl font-bold mb-4">Welcome! Which college do you attend?</h1>
            
            {isLoading ? (
                <div className="text-gray-500 my-4">Loading 39,000+ colleges...</div>
            ) : (
                <input 
                    type="text" 
                    placeholder="Search College..." 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)} 
                    className="w-full p-2 border rounded mb-4 text-black"
                />
            )}

            <ul className="bg-white shadow rounded overflow-hidden max-h-80 overflow-y-auto text-black">
                {filteredColleges.map((college, index) => (
                    <li 
                        key={index} 
                        onClick={() => handleSelectCollege(college)}
                        className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    >
                        {college}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CollegeSelector;