import "./animatedSearchField.css"
import glass from "./../../../assets/vectors/glass.svg"
const AnimatedSearchField = () => {
    return(
        <div class="search-bar">
            <input type="search" class="search-input" placeholder="Search here..." tabindex="0" />
            <button class="search-submit" tabindex="0">
                <img src={glass} alt="glass" className="searchIcon"/>
            </button>
        </div>
);}

export default AnimatedSearchField;