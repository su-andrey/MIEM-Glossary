import glass from "./../../assets/vectors/glass.svg"
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./../../assets/vectors/logo/staticBook.svg"
import styles from "./header.module.css"
import AnimatedSearchField from "../UI/animatedSearchField/AnimatedSearchField";
import {motion, LayoutGroup, AnimatePresence} from 'framer-motion'
import Line from "./subcomponents/Line";
const Header = () => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const handleClick = (ind)=> {
        setActiveIndex(ind);
    }
    return (<>
    <div className={styles.wrapper}>
        <Link to="/" onClick={()=>handleClick(-1)}>
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
        <LayoutGroup>
            <div className={styles.navigation}>
                <NavLink to="/prepods" className={styles.navItemLink}>
                <AnimatePresence >
                    {activeIndex == 0 && <Line />}
                </AnimatePresence>
                    <div onClick={()=>handleClick(0)} className={styles.navItem}>Преподы</div>
                </NavLink>
                <NavLink to="/food" className={styles.navItemLink}>
                    <AnimatePresence>
                        {activeIndex == 1 && <Line />}
                    </AnimatePresence>
                    <div onClick={()=>handleClick(1)} className={styles.navItem}>Куда сходить</div></NavLink>
                <NavLink to="/questions" className={styles.navItemLink}>
                    <AnimatePresence >
                        {activeIndex == 2 && <Line />}
                    </AnimatePresence>
                    <div onClick={()=>handleClick(2)} className={styles.navItem}>Форум</div>
                </NavLink>
                <NavLink to="/cabinet" className={styles.navItemLink}>
                    <AnimatePresence >
                        {activeIndex == 3 && <Line />}
                    </AnimatePresence>
                    <div onClick={()=>handleClick(3)} className={styles.navItem}>Профиль</div>
                </NavLink>
                <AnimatedSearchField></AnimatedSearchField>
            </div>
        </LayoutGroup>
    </div>
    </>);
}

export default Header;