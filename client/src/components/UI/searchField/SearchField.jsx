import styles from "./searchField.module.css"
import glass from "./../../../assets/vectors/glass_grey.svg"
const SearchField = ({initial}) => {
    return (
    <>
        <div className={styles.wrapper} style={{minWidth: "1em"}}>
            <input type="search" placeholder="Хочу найти..." className={styles.field} style={{minWidth: "1em"}} value={initial}/>
            <img draggable="false" src={glass} alt="glass icon" className={styles.glass} style={{minWidth: "1em"}}/>
        </div>
    </>
    );
}

export default SearchField;