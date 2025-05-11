import glass from "./../../assets/vectors/glass.svg"
import { Link, NavLink } from "react-router-dom";
import logo from "./../../assets/vectors/logo/staticBook.svg"
import styles from "./header.module.css"
import AnimatedSearchField from "../UI/animatedSearchField/AnimatedSearchField";
const Header = () => {
    return (<>
    <div className={styles.wrapper}>
        <Link to="/">
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
        </Link>
        <div className={styles.navigation}>
            <span className={styles.navItem}><NavLink to="/prepods" className={({isActive}) => !isActive ? styles.navItemLink : styles.navItemLink_active}>Преподы</NavLink></span>
            <span className={styles.navItem}><NavLink to="/food" className={({isActive}) => !isActive ? styles.navItemLink : styles.navItemLink_active}>Куда сходить</NavLink></span>
            <span className={styles.navItem}><NavLink to="/questions" className={({isActive}) => !isActive ? styles.navItemLink : styles.navItemLink_active}>Форум</NavLink></span>
            <span className={styles.navItem}><NavLink to="/cabinet" className={({isActive}) => !isActive ? styles.navItemLink : styles.navItemLink_active}>Профиль</NavLink></span>
            <AnimatedSearchField></AnimatedSearchField>
            
        </div>
    </div>
    </>);
}

export default Header;