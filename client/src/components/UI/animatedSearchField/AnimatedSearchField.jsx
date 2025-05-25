import "./animatedSearchField.css"
import glass from "./../../../assets/vectors/glass.svg"
import { useEffect } from "react";
const AnimatedSearchField = () => {
    
    return(
        <div className="search-bar">
            <input type="search" className="search-input" placeholder="Search here..." tabIndex={0} />
            <button className="search-submit" tabIndex={0}>
                <img src={glass} alt="glass" className="searchIcon"/>
            </button>
        </div>
);}

export default AnimatedSearchField;