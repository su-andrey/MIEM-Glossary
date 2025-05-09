import styles from "./searchField.module.css"
import glass from "./../../../assets/vectors/glass_grey.svg"
const SearchField = () => {
    return (<>
    <div className={styles.wrapper}>
        <input type="search" placeholder="Search here..." className={styles.field} />
        <img draggable="false" src={glass} alt="glass icon" className={styles.glass} />
    </div>
    </>);
}

export default SearchField;