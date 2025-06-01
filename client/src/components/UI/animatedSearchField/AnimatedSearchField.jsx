import "./animatedSearchField.css"
import glass from "./../../../assets/vectors/glass.svg"
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const AnimatedSearchField = () => {
    const [search, setSearch] = useState("")
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleChange = (e)=>{
        setSearch(e.target.value)
    }

    const handleSubmit = ()=>{
        localStorage.removeItem('search')
        localStorage.setItem("search", search)
        setSearch("")
    }

    return(
        <div className="search-bar">
            <input 
                type="search" 
                className="search-input" 
                placeholder="Search here..." 
                tabIndex={0} 
                onChange={(e)=>{handleChange(e)}}
                value={search || ""}
            />
            <button className="search-submit" tabIndex={0}>
                <Link to="/search" onClick={()=>{handleSubmit()}}>
                    <img src={glass} alt="glass" className="searchIcon"/>
                </Link>
            </button>
        </div>
);}

export default AnimatedSearchField;