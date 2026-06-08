import React,{useState} from "react";
import {getColleges} from 'indian-colleges';

const CollegeSelector = ()=>{
    const allColleges = getColleges();
    
    const [search,setSearch] = useState("");
    const filteredColleges = allColleges.filter(college => 
        college.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50);  

    return(
        <div>
            <input type="text" placeholder="Search College" value={search} onChange={(e) => setSearch(e.target.value)} />
            <ul>
                {filteredColleges.map((college,index)=>(<li key={index}>{college.name}</li>))}
            </ul>
        </div>
    )
}
export default CollegeSelector;