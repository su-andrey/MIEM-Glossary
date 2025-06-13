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
import AnimatedSearchButton from "../UI/searchButton/AnimatedSearchButton";
const Header = () => {
    const [activeIndex, setActiveIndex] = useState(-1);
    const [username, setUsername] = useState("");
    const [isMenuOpen, setMenuOpen] = useState(false);

    const email = useSelector(state => state.main.email);

    useEffect(() => {
        if (email) {
            let name = email.split('@')[0] || "";
            if (name.length > 12) name = name.slice(0, 12);
            name = name.charAt(0).toUpperCase() + name.slice(1);
            setUsername(name);
        } else {
            setUsername("");
        }
    }, [email]);

    const handleClick = (ind) => {
        setActiveIndex(ind);
        setMenuOpen(false);
    };

    const location = useLocation();
    const activeCurrentIndex = (() => {
        switch (location.pathname) {
            case "/prepods": return 0;
            case "/food": return 1;
            case "/questions": return 2;
            case "/cabinet": return 3;
            default: return -1;
        }
    })();

    return (
        <>
            <div className={styles.wrapper}>
                <Link to="/" onClick={() => handleClick(-1)}>
                    <div className={styles.headerBlock}>
                        <img src={logo} alt="book" className={styles.logo} />
                        <div className={styles.textContainer}>
                            <div className={styles.title}>Глоссарий МИЭМ</div>
                            <div className={styles.caption}>Анонимность превыше всего</div>
                        </div>
                    </div>
                </Link>

                <LayoutGroup>
                    <div className={styles.navigation}>
                        <NavLink to="/prepods" className={styles.navItemLink}>
                            <AnimatePresence>
                                {activeCurrentIndex === 0 && <Line />}
                            </AnimatePresence>
                            <div onClick={() => handleClick(0)} className={styles.navItem}>Преподы</div>
                        </NavLink>
                        <NavLink to="/food" className={styles.navItemLink}>
                            <AnimatePresence>
                                {activeCurrentIndex === 1 && <Line />}
                            </AnimatePresence>
                            <div onClick={() => handleClick(1)} className={styles.navItem}>Куда сходить</div>
                        </NavLink>
                        <NavLink to="/questions" className={styles.navItemLink}>
                            <AnimatePresence>
                                {activeCurrentIndex === 2 && <Line />}
                            </AnimatePresence>
                            <div onClick={() => handleClick(2)} className={styles.navItem}>Форум</div>
                        </NavLink>
                        <NavLink to="/cabinet" className={styles.navItemLink}>
                            <AnimatePresence>
                                {activeCurrentIndex === 3 && <Line />}
                            </AnimatePresence>
                            <div onClick={() => handleClick(3)} className={styles.navItem}>
                                {username || "Вход"}
                            </div>
                        </NavLink>
                        <div className={styles.searchInputComponent}>
                            <AnimatedSearchField />
                        </div>
                        <div className={styles.searchButton}>
                            <AnimatedSearchButton />
                        </div>
                    </div>
                </LayoutGroup>


                <div className={styles.burger} onClick={() => setMenuOpen(prev => !prev)}>
                    <button className={styles.burger__menu + " " + (isMenuOpen ? styles.burger_menu__active : '')}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>


            <div className={`${styles.sideMenu} ${isMenuOpen ? styles.sideMenuOpen : ""}`}>
                <NavLink to="/cabinet" onClick={() => handleClick(3)} className={styles.navSideItem}>
                    {username || "Вход"}
                </NavLink>
                <NavLink to="/prepods" onClick={() => handleClick(0)} className={styles.navSideItem}>Преподы</NavLink>
                <NavLink to="/food" onClick={() => handleClick(1)} className={styles.navSideItem}>Куда сходить</NavLink>
                <NavLink to="/questions" onClick={() => handleClick(2)} className={styles.navSideItem}>Форум</NavLink>
                <NavLink to="/search" onClick={() => handleClick(4)} className={styles.navSideItem}>Поиск</NavLink>
            </div>
        </>
    );
};

export default Header;