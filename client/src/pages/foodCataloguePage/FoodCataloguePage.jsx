import styles from "./foodCataloguePage.module.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { uid } from "uid";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, FreeMode, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import waitForImagesToLoad from "./../../custom hooks/helpers/waitForImagesToLoad"
import getPostsByCategoryID from "../../store/selectors/getPostsByCategoryID";
import getCategories from "../../store/selectors/getCategories";
import CafeListCard from "../../components/cafeListCard/CafeListCard";
import SearchField from "../../components/UI/searchField/SearchField";
import AnswerField from "../../components/UI/answerField/AnswerField";
import Loader from "../../components/UI/loader/Loader";
import Loader1 from "../../components/UI/loader1/Loader1";
import AppLoaderWrapper from "../appLoaderWarapper/AppLoaderWrapper";

const FoodCataloguePage = () => {
    const [isSliderReady, setSliderReady] = useState(false);
    const { category } = useParams();
    console.log(category)
    const posts = useSelector(state => getPostsByCategoryID(state, category));
    console.log(posts)
    const categories = useSelector(state => getCategories(state));
    const currentCategory = categories.find(categoryEl => categoryEl.category_id == category)?.name || "Заведения";
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
            setSliderReady(true)
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);
    if (!ready) return <Loader1/>;
    return (
        <AppLoaderWrapper>
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.textWrapper}>
                        <div className={styles.title}>{currentCategory}</div>
                        <div className={styles.caption}>Выберите интересующее заведение</div>
                    </div>
                    <SearchField />
                </div>

                {isSliderReady ? <div className={styles.sliderWrapper}>
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
                            momentumRatio: 3,
                            momentumVelocityRatio: 1,
                        }}
                        keyboard={{
                            enabled: true,
                        }}
                        parallax={{
                            enabled: true,
                        }}
                    >
                        {posts.length > 0 ? (
                            posts.map((post) => (
                                <SwiperSlide key={uid()}>
                                    <Link to={`/food/${category}/${post.id}`}>
                                        <CafeListCard data={post} />
                                    </Link>
                                </SwiperSlide>
                            ))
                        ) : (
                            <Loader1 />
                        )}
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
                :
                <Loader1 />
                }

                <AnswerField />
            </div>
        </AppLoaderWrapper>
    );
};

export default FoodCataloguePage;