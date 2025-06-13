import "./animatedSearchField.css";
import glass from "./../../../assets/vectors/glass.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AnimatedSearchField = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        const query = search.trim();
        if (query.length > 0) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setSearch("");
        }
        else{
            navigate(`/search`);
        }
    };

    return (
        <div className="search-bar">
            <input 
                type="search" 
                className="search-input" 
                placeholder="Search here..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit();
                    }
                }}
            />
            <button className="search-submit" onClick={handleSubmit} tabIndex={0}>
                <img src={glass} alt="glass" className="searchIcon" />
            </button>
        </div>
    );
};

export default AnimatedSearchField;