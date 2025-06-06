import "./animatedSearchButton.css";
import glass from "./../../../assets/vectors/glass.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AnimatedSearchButton = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search`);
    };

    return (
        <div className="search-barr">
            <button className="search-submitr" onClick={handleSubmit} tabIndex={0}>
                <img src={glass} alt="glass" className="searchIcon" />
            </button>
        </div>
    );
};

export default AnimatedSearchButton;