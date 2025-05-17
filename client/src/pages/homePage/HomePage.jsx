import styles from "./homePage.module.css"
import crystal1 from "./../../assets/png/crystals/crystal1.png"
import crystal2 from "./../../assets/png/crystals/crystal3.png"
import crystal3 from "./../../assets/png/crystals/crystal2.png"
import Loader from "../../components/UI/loader/Loader"
import { useState, useEffect } from "react"
const HomePage = () => {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const handleLoad = () => setReady(true);
    if (document.readyState === 'complete') {
        handleLoad();
    } 
    else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }
    }, []);
    if (!ready) return <Loader/>;

    return (<>
        <div className={styles.wrapper}>      
            <div className={styles.container}>
                <div className={styles.textContainer}>
                    <div className={styles.title}>Мы - Глоссарий МИЭМ</div>
                    <div className={styles.paragraf}>Анонимность, честность, конфиденциальность</div>
                </div>
                <img src={crystal1} alt="MIEM logo" className={styles.crystal} />
            </div>

            
            <div className={styles.container}>
                <img src={crystal2} alt="MIEM logo" className={styles.crystal + " " + styles.crystal2} loading="lazy"/>
                <div className={styles.textContainer}>
                    <div className={styles.title}>Здесь вы можете...</div>
                    <div className={styles.paragraf}>Искать правдивые ответы и отзывы</div>
                    <div className={styles.paragraf}>Задавать вопросы прямо и открыто</div>
                    <div className={styles.paragraf}>Давать фидбек честно</div>
                </div>
            </div>

            
            <div className={styles.container}>
                <div className={styles.textContainer}>
                    <div className={styles.title}>Тут каждый студент...</div>
                    <div className={styles.paragraf}>Остается полностью анонимным</div>
                    <div className={styles.paragraf}>Может и должен критиковать</div>
                    <div className={styles.paragraf}>Может помогать другим узнать истину</div>
                </div>
                <img src={crystal3} alt="MIEM logo" className={styles.crystal} loading="lazy"/>
            </div>
        </div>
    </>);
}

export default HomePage;