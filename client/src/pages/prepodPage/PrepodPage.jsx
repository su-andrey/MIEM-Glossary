import styles from "./prepodPage.module.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { uid } from "uid";
import { useState, useEffect } from "react";

import getPostsByCategory from "../../store/selectors/getPostsByCategoryID";
import getCategories from "../../store/selectors/getCategories";
import CafeListCard from "../../components/cafeListCard/CafeListCard";
import AnswerField from "../../components/UI/answerField/AnswerField";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, FreeMode, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PrepodCard from "../../components/prepodCard/PrepodCard";
import Loader from "../../components/UI/loader/Loader";
const PrepodPage = () => {
    const categories = useSelector(state => getCategories(state));
    const category = categories.find((category) => category.name === "Препод");
    const posts = useSelector(state => getPostsByCategory(state, category?.id));
    console.log(posts)
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
    return (
        <div className={styles.wrapper}>
            <div className={styles.topWrapper}>
                <div className={styles.textWrapper}>
                    <div className={styles.title}>Преподы</div>
                    <div className={styles.caption}>
                        Выберите интересующего преподавателя
                    </div>
                </div>
            </div>
            
            <div className={styles.sliderWrapper}>
                    <Swiper
                        className={styles.swiper}
                        modules={[Navigation, Pagination, Parallax, FreeMode, Keyboard, Mousewheel]}
                        spaceBetween={40}
                        slidesPerView={3}
                        loop={true}
                        navigation={{
                            nextEl: `.${styles.swiperButtonNext}`,
                            prevEl: `.${styles.swiperButtonPrev}`
                        }}
                        pagination={{
                            el: `.${styles.swiperPagination}`,
                            clickable: true
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        freeMode={{
                            enabled: true,
                            momentumBounceRatio: 1.5,
                            momentumRatio: 4,
                            momentumVelocityRatio: 1,
                        }}
                        keyboard={{
                            enabled: true,
                        }}
                        parallax={{
                            enabled: true,
                        }}
                    >
                        {posts.map((post) => (
                            <SwiperSlide key={uid()}>
                                <Link to={`/prepods/${post.id}`}>
                                    <PrepodCard data={post} />
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className={styles.swiperButtonPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </div>

                    <div className={styles.swiperButtonNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                        </svg>
                    </div>
                    <div className={styles.swiperPagination}></div>
                </div>
            
            <AnswerField 
                placeholder="Предложить препода..."
                caption="Забыли кого-то? Напомните нам"
            />
        </div>
    );
}

export default PrepodPage;