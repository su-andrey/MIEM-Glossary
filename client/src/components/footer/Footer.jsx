import styles from "./footer.module.css"
import gh_logo from "./../../assets/vectors/socials/gh.svg"
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
const Footer = () => {
    const profile1 = useRef(null);
    const profile2 = useRef(null);
    const profile3 = useRef(null);
    return (
    <div className={styles.wrapper}>
        <div className={styles.header}>MIEM Glossary<span style={{fontSize:"35%"}}>©</span></div>
        <div className={styles.subheader}>Наша команда</div>
        <div className={styles.caption}>Переходите и следите за нашими другими проектами</div>
        <div className={styles.socials}>
            <a href="https://github.com/Segun228">
                <div className={styles.subcontainer}>
                    <div className={styles.profileGlow}>
                        <div className={styles.profile1 + " " + styles.profile} role="button"></div>
                    </div>
                    <div className={styles.name}>Segun228</div>
                </div>
            </a>
            <a href="https://github.com/su-andrey">
                <div className={styles.subcontainer}>
                    <div className={styles.profileGlow}>
                        <div className={styles.profile2 + " " + styles.profile} role="button"></div>
                    </div>
                    <div className={styles.name}>Su-Andrey</div>
                </div>
            </a>
            <a href="https://github.com/MatTwix">
                <div className={styles.subcontainer}>
                    <div className={styles.profileGlow}>
                        <div className={styles.profile3 + " " + styles.profile} role="button"></div>
                    </div>
                    <div className={styles.name}>MatTwix</div>
                </div>
            </a>
        </div>
    </div>);
}

export default Footer;