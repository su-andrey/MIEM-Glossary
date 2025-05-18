import styles from "./homePage.module.css"
import crystal1 from "./../../assets/png/crystals/crystal1.png"
import crystal2 from "./../../assets/png/crystals/crystal3.png"
import crystal3 from "./../../assets/png/crystals/crystal2.png"
import Loader from "../../components/UI/loader/Loader"
import { useState, useEffect, useRef } from "react"
import { MActionButton } from "../../components/UI/actionButton/ActionButton"
import { motion, useScroll, useTransform, useSpring, transform } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [ready, setReady] = useState(false);
    useEffect(() => {
        const handleLoad = () => setReady(true);
        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);

    const crystal1Ref = useRef(null)
    const crystal2Ref = useRef(null)
    const crystal3Ref = useRef(null)

    const { scrollYProgress: scroll1 } = useScroll({
        initial: false,
        target: crystal1Ref,
        offset: ["start end", "end start"],
        layoutEffect: true
    })
    const { scrollYProgress: scroll2 } = useScroll({
        initial: false,
        target: crystal2Ref,
        offset: ["start end", "end start"],
        layoutEffect: true
    })
    const { scrollYProgress: scroll3 } = useScroll({
        initial: false,
        target: crystal3Ref,
        offset: ["start end", "end start"],
        layoutEffect: true
    })

    const y1 = useTransform(scroll1, [0, 1], ["600px", "-1200px"])
    const y2 = useTransform(scroll2, [0, 1], ["900px", "-1200px"])
    const y3 = useTransform(scroll3, [0, 1], ["900px", "-700px"])

    const textAnimation = {
        hidden: {
            opacity: 0,
        },
        visible: custom => ({
            opacity: 1,
            transition: {
                delay: custom * 0.3,
            }
        }),
    }

    const leftTextAnimation = {
        hidden: {
            opacity: 0,
            x: -100,
        },
        visible: custom => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: custom * 0.4,
                duration: 0.6, 
                ease: "easeOut",
            }
        }),
    }

    const topLeftTextAnimation = {
        hidden: {
            opacity: 0,
            x: -100,
        },
        visible: custom => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: custom * 0.4,
                duration: 0.6, 
                ease: "easeOut",
            }
        }),
    }

    const rightTextAnimation = {
        hidden: {
            opacity: 0,
            x: 100,
        },
        visible: custom => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: custom * 0.4,
                duration: 0.6, 
                ease: "easeOut",
            }
        }),
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

    const image1Animation = {
        hidden: {
            opacity: 0,
            y: 600,
        },
        visible: custom => ({
            opacity: 1,
        }),
    }

    useEffect(() => {
    if (ready) {
        // Принудительно триггерим scroll событие
        window.scrollTo(window.scrollX, window.scrollY + 1);
        window.scrollTo(window.scrollX, window.scrollY);
    }
        }, [ready]);

    if (!ready) return <Loader />;
    return (
        <>
            <div
                className={styles.wrapper}
            >
                <div className={styles.container}>
                    <motion.div
                        custom={2}
                        variants={middleTextAnimation}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        className={styles.metatitle}
                        style={{ marginBottom: "0.5vh" }}
                    >
                        Добро пожаловать
                    </motion.div>
                </div>

                <div className={styles.container}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.8, margin: "100px 0px" }}
                        className={styles.textContainer}
                        custom={2}
                        variants={topLeftTextAnimation}
                    >
                        <motion.div custom={3} variants={topLeftTextAnimation} className={styles.title} style={{ marginBottom: "0.5vh" }}>Мы - Глоссарий МИЭМ</motion.div>
                        <motion.div custom={4} variants={topLeftTextAnimation} className={styles.paragraf}>Анонимность, честность, конфиденциальность</motion.div>
                        <motion.div custom={5} variants={topLeftTextAnimation} className={styles.paragraf}> - это наши фундаментальные принципы</motion.div>
                    </motion.div>
                    <motion.img
                        ref={crystal1Ref}
                        
                        style={{ y: y1 }}              
                        src={crystal1}
                        alt="MIEM logo"
                        className={styles.crystal}
                        loading="lazy"
                    />
                </div>

                <div className={styles.container}>
                    <motion.img
                        ref={crystal2Ref}
                        style={{ y: y2 }}
                        src={crystal2}
                        alt="MIEM logo"
                        className={styles.crystal + " " + styles.crystal2}
                        loading="lazy"
                    />
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 1 }}
                        custom={1}
                        variants={rightTextAnimation}
                        className={styles.textContainer}
                    >
                        <motion.div custom={1} variants={rightTextAnimation} className={styles.title}>Здесь вы можете...</motion.div>
                        <motion.div custom={2} variants={rightTextAnimation} className={styles.paragraf}>Искать правдивые ответы и отзывы</motion.div>
                        <motion.div custom={3} variants={rightTextAnimation} className={styles.paragraf}>Задавать вопросы прямо и открыто</motion.div>
                        <motion.div custom={4} variants={rightTextAnimation} className={styles.paragraf}>Давать фидбек честно и откровенно</motion.div>
                    </motion.div>
                </div>

                <div className={styles.container}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 1 }}
                        custom={1}
                        variants={leftTextAnimation}
                        className={styles.textContainer}
                    >
                        <motion.div custom={1} variants={leftTextAnimation} className={styles.title}>Тут каждый студент...</motion.div>
                        <motion.div custom={2} variants={leftTextAnimation} className={styles.paragraf}>Остается полностью анонимным</motion.div>
                        <motion.div custom={3} variants={leftTextAnimation} className={styles.paragraf}>Может и должен критиковать</motion.div>
                        <motion.div custom={4} variants={leftTextAnimation} className={styles.paragraf}>Может помогать другим узнать истину</motion.div>
                    </motion.div>
                    <motion.img
                        ref={crystal3Ref}
                        style={{ y: y3 }}
                        src={crystal3}
                        alt="MIEM logo"
                        className={styles.crystal}
                        loading="lazy"
                    />
                </div>

                <div className={styles.container}>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.7 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        custom={1}
                        variants={middleTextAnimation}
                        className={styles.bottomContainer}
                        style={{ textAlign: "center" }}
                    >
                        <motion.div custom={1} variants={middleTextAnimation} className={styles.title} style={{ marginBottom: "-2.5vh" }}>С чего начать?</motion.div>
                        <motion.div custom={2} variants={middleTextAnimation} className={styles.paragraf}>Авторизуйтесь, чтобы добавлять и редактировать отзывы, <br />а также оставлять реакции и писать комментарии</motion.div>
                        <MActionButton custom={3} variants={middleTextAnimation} text="Войти" onClick={()=>navigate("/login", { state: { from: location.pathname } })}/>
                    </motion.div>
                </div>
            </div>
        </>
    )
}

export default HomePage