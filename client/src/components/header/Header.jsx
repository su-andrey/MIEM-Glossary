import glass from "./../../assets/vectors/glass.svg"
import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./../../assets/vectors/logo/staticBook.svg"
import styles from "./header.module.css"
import AnimatedSearchField from "../UI/animatedSearchField/AnimatedSearchField";
import {motion, LayoutGroup, AnimatePresence} from 'framer-motion'
import { useLocation } from "react-router-dom";
import Line from "./subcomponents/Line";
import { useSelector } from "react-redux";
import checkLogIn from "../../queries/USER/checkLogIn";
import getMe from "../../queries/USER/getMe";
const Header = () => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const [username, setUsername] = useState("");
    let email = useSelector(state => state.main.email)
    useEffect(() => {
        if (email) {
            let name = email.split('@')[0] || "";
            if (name.length > 12) {
                name = name.slice(0, 12);
            }
            name = name.charAt(0).toUpperCase() + name.slice(1);
            setUsername(name);
        } else {
            setUsername("");
        }
    }, [email]);

    const handleClick = (ind)=> {
        setActiveIndex(ind);
    }
    const location = useLocation();

    const getIndexByPath = (path) => {
        switch (path) {
            case "/prepods": return 0;
            case "/food": return 1;
            case "/questions": return 2;
            case "/cabinet": return 3;
            default: return -1;
        }
    };

    const activeCurrentIndex = getIndexByPath(location.pathname);
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
                    {activeCurrentIndex== 0 && <Line />}
                </AnimatePresence>
                    <div onClick={()=>handleClick(0)} className={styles.navItem}>Преподы</div>
                </NavLink>
                <NavLink to="/food" className={styles.navItemLink}>
                    <AnimatePresence>
                        {activeCurrentIndex == 1 && <Line />}
                    </AnimatePresence>
                    <div onClick={()=>handleClick(1)} className={styles.navItem}>Куда сходить</div></NavLink>
                <NavLink to="/questions" className={styles.navItemLink}>
                    <AnimatePresence >
                        {activeCurrentIndex == 2 && <Line />}
                    </AnimatePresence>
                    <div onClick={()=>handleClick(2)} className={styles.navItem}>Форум</div>
                </NavLink>
                <NavLink to="/cabinet" className={styles.navItemLink}>
                    <AnimatePresence >
                        {activeCurrentIndex == 3 && <Line />}
                    </AnimatePresence>
                    <div onClick={()=>handleClick(3)} className={styles.navItem}>{username || "Вход"}</div>
                </NavLink>
                <AnimatedSearchField></AnimatedSearchField>
            </div>
        </LayoutGroup>
    </div>
    </>);
}

export default Header;