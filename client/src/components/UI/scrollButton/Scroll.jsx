import styles from "./scroll.module.css"
import useScrollToTop from "./../../../custom hooks/useScrollToTop.js";
import { IoIosArrowDropup } from "react-icons/io";
import { useState, useEffect } from "react";
const Scroll = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 350 && !isVisible) {
                setIsVisible(true);
            }
            else if (scrollY <= 350 && isVisible) {
                setIsVisible(false);
            }
        }
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isVisible]);

    return (
        <IoIosArrowDropup 
        className={styles.main + " " + (isVisible ? styles.visible : styles.hidden)}
        onClick={
            ()=>{window.scrollTo({ top: 0, behavior: 'smooth' });}
        }
        />
    );}

export default Scroll;