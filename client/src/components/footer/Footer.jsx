import styles from "./footer.module.css"
import gh_logo from "./../../assets/vectors/socials/gh.svg"
import gsap from "gsap";
import React, { useEffect, useRef, useState } from "react";
const Footer = () => {
    const [open, setOpen] = useState(false);
    const profile1 = useRef(null);
    const profile2 = useRef(null);
    const profile3 = useRef(null);
    const handleClick = ()=>{
        setOpen(true)
    }
    
    return (
    <div className={styles.wrapper}>
        <div className={styles.header}>MIEM Glossary<span style={{fontSize:"35%"}}>©</span></div>
        <div className={styles.subheader}>Наша команда</div>
        <div className={styles.caption}>Переходите и следите за нашими другими проектами</div>
        <div className={styles.socials}>
            {!open && 
                <div className={styles.gh_container}>
                    <img src={gh_logo} alt="github" className={styles.gh_logo} onClick={()=>handleClick()}/>
                    <div className={styles.subheader}>Click Me</div>
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
        </div>
    </div>);
}

export default Footer;