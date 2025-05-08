import glass from "./../../assets/vectors/glass.svg"
import { Link } from "react-router-dom";
import logo from "./../../assets/vectors/logo/staticBook.svg"
import styles from "./header.module.css"
import AnimatedSearchField from "../UI/animatedSearchField/AnimatedSearchField";
const Header = () => {
    return (<>
    <div className={styles.wrapper}>
        <div className={styles.headerBlock}>
            <img src={logo} alt="book" className={styles.logo}/>
            <div className={styles.textContainer}>
                <div className={styles.title}>
                    Глоссарий МИЭМ
                </div>
                <div className={styles.caption}>
                    Анонимность превыше всего
                </div>
            </div>
        </div>
        <div className={styles.navigation}>
            <span className={styles.navItem}><Link className={styles.navItemLink}>Преподы</Link></span>
            <span className={styles.navItem}><Link className={styles.navItemLink}>Куда сходить</Link></span>
            <span className={styles.navItem}><Link className={styles.navItemLink}>Форум</Link></span>
            <span className={styles.navItem}><Link className={styles.navItemLink}>Профиль</Link></span>
            <AnimatedSearchField></AnimatedSearchField>
            
        </div>
    </div>
    </>);
}

export default Header;