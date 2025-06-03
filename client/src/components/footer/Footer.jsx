import styles from "./footer.module.css"
import gh_logo from "./../../assets/vectors/socials/gh.svg"
import {motion} from "framer-motion"
import React, { useEffect, useRef, useState } from "react";
const Footer = () => {
    const [open, setOpen] = useState(false);
    const profile1 = useRef(null);
    const profile2 = useRef(null);
    const profile3 = useRef(null);
    const handleClick = ()=>{
        setOpen(true)
    }

    const middleTextAnimation = {
        hidden: {
            opacity: 0,
            y: 40,
        },
        visible: custom => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: custom * 0.3,
                duration: 0.4, 
                ease: "easeOut",
            }
        }),
    }

    return (
    <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        custom={0}
        variants={middleTextAnimation}
        className={styles.wrapper}
    >
        <motion.div custom={2} variants={middleTextAnimation} className={styles.header}>MIEM Glossary<span style={{fontSize:"35%"}}>©</span></motion.div>
        <div className={styles.logical}>
            <motion.div custom={3} variants={middleTextAnimation} className={styles.subheader}>Наша команда</motion.div>
            <motion.div custom={4} variants={middleTextAnimation} className={styles.caption}>Переходите и следите за нашими другими проектами</motion.div>
        </div>
        <motion.div custom={5} variants={middleTextAnimation} className={styles.socials}>
            {!open && 
                <div className={styles.gh_container}>
                    <img src={gh_logo} alt="github" className={styles.gh_logo} onClick={()=>handleClick()}/>

                </div>}
            {open && 
                <>
                    <a className={styles.anchor1} href="https://github.com/Segun228">
                        <div className={styles.subcontainer}>
                            <div className={styles.profileGlow}>
                                <div className={styles.profile1 + " " + styles.profile} role="button"></div>
                            </div>
                            <div className={styles.name}>Segun228</div>
                        </div>
                    </a>
                    <a className={styles.anchor2} href="https://github.com/su-andrey">
                        <div className={styles.subcontainer}>
                            <div className={styles.profileGlow}>
                                <div className={styles.profile2 + " " + styles.profile} role="button"></div>
                            </div>
                            <div className={styles.name}>Su-Andrey</div>
                        </div>
                    </a>
                    <a className={styles.anchor3} href="https://github.com/MatTwix">
                        <div className={styles.subcontainer}>
                            <div className={styles.profileGlow}>
                                <div className={styles.profile3 + " " + styles.profile} role="button"></div>
                            </div>
                            <div className={styles.name}>MatTwix</div>
                        </div>
                    </a>
                </>}
        </motion.div>
    </motion.div>);
}

export default Footer;