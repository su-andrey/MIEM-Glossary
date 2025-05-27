import styles from "./foodPage.module.css"
import CafeCard from "../../components/cafeCard/CafeCard.jsx";
import { uid } from "uid";
import image from "./../../assets/jpg/nothing/nothing.jpeg"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import getCategories from "../../store/selectors/getCategories.js";
import Loader from "../../components/UI/loader/Loader.jsx";
import { useState, useEffect } from "react";
import Loader1 from "../../components/UI/loader1/Loader1.jsx";
import AppLoaderWrapper from "../appLoaderWarapper/AppLoaderWrapper.jsx";
const FoodMainPage = () => {
    const data = useSelector(state => getCategories(state));
    const [ready, setReady] = useState(false);
    useEffect(() => {
        const MIN_LOAD_TIME = 0;
        const start = Date.now();

        const handleLoad = () => {
            const elapsed = Date.now() - start;
            const remaining = Math.max(MIN_LOAD_TIME - elapsed, 0);

            setTimeout(() => {
                setReady(true);
            }, remaining);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);
    if (!ready) return <Loader1/>;
    return (
    <AppLoaderWrapper >
    <>
        <div className={styles.wrapper}>
            <div className={styles.textContainer}>
                <div className={styles.title}>
                    Куда сходить?
                </div>
                <div className={styles.caption}>
                    Выберите интересующую услугу или заведение
                </div>
            </div>
            <div className={styles.container}>
                {data.length > 0 ?
                    data.map((category) => {
                        if(category.name == "Кофе" || category.name == "Фастфуд и шаурма" || category.name == "Копирки" || category.name == "Магазины"){
                            return(
                            <Link key={uid()} to={`/food/${category.id}`}><CafeCard className={styles.containerItem}  data={category} ></CafeCard></Link>
                        )}
                    })
                    :
                    <img src={image} alt="void" style={{width:"40vw"}}/>
                }
            </div>
        </div>
    </>
    </AppLoaderWrapper>);
}

export default FoodMainPage;