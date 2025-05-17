import styles from "./SinglePrepodPage.module.css"
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import Question from "../../../components/question/Question";
import { Link } from "react-router-dom";
import { uid } from "uid";
import AnswerField from "../../../components/UI/answerField/AnswerField";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, FreeMode, Keyboard, Mousewheel, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useParams } from "react-router-dom";
import Review from "../../../components/review/Review";
import getPrepodByID from "../../../store/selectors/forSinglePages/getPrepodByID";
import getCategories from "../../../store/selectors/getCategories";
import getPostsByCategory from "../../../store/selectors/getPostsByCategoryID";
import Stars from "../../../components/UI/starsActive/Stars";
import useGetFiveScale from "../../../custom hooks/useGetFiveScale";
import getPrepodReviewsByID from "../../../store/selectors/forSinglePages/getPrepodReviewsByID";
import image from "./../../../assets/jpg/cafe_categories/soup.jpg"
import Scroll from "../../../components/UI/scrollButton/Scroll";
import Loader from "../../../components/UI/loader/Loader";

const SinglePrepodPage = () => {
    let categories = useSelector(state => getCategories(state));
    let category = categories.find((category) => category.name == "Препод");
    let posts = useSelector(state => getPostsByCategory(state, category.id));
    const post_id = useParams().id;
    const prepod = useSelector(state => getPrepodByID(state, post_id));
    console.log(prepod)
    const reviews = useSelector(state => getPrepodReviewsByID(state, prepod.id))
    console.log(post_id)
    console.log("Препод: ", prepod)
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
    return(
        <>
            <Scroll />
            <div className={styles.wrapper}>
                        <div className={styles.topContainer}>
                            <div className={styles.topWrapper}>
                                <div className={styles.title}>
                                    {prepod.name}
                                </div>
                                <div className={styles.caption}>
                                    {prepod.body}
                                </div>
                                <div className={styles.gradeBlock}>
                                    <div className={styles.grade}>
                                        {useGetFiveScale(prepod, 1)}
                                    </div>
                                    <Stars defaultRating={useGetFiveScale(prepod)}/>
                                </div>
                            </div>
                            <div className={styles.imageContainer}>
                                <Swiper
                                    className={styles.swiper}
                                    modules={[Navigation, Pagination, Parallax, FreeMode, Keyboard, Mousewheel, Autoplay, EffectCoverflow]}
                                    spaceBetween={20}
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
                                    centeredSlides={true}
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
                                    effect="coverflow"
                                    coverflowEffect={{
                                        rotate: 30,
                                        stretch: 0,
                                        depth: 100,
                                        modifier: 1,
                                        slideShadows: false,
                                    }}

                                >
                                    <SwiperSlide>
                                        <img src={image} className={styles.image}></img>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <img src={image} className={styles.image}></img>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <img src={image} className={styles.image}></img>
                                    </SwiperSlide>
                                    <SwiperSlide>
                                        <img src={image} className={styles.image}></img>
                                    </SwiperSlide>
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
                        </div>
                </div>
                <div className={styles.wholeWrapper}>
                    <div className={styles.topWrapper}>
                        <div className={styles.textWrapper}>
                            <div className={styles.subtitle}>
                                Отзывы:
                            </div>
                            <div className={styles.sliderWrapper}>
                                {
                                    reviews.map((review)=>{
                                        return(
                                            <Review key={uid()} data={review}></Review>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <AnswerField
                        settings={{marginTop:'1vh'}}
                        width={"40vw"} 
                        height={"30vh"}
                        placeholder={"Поделитесь мнением?"}
                        caption={"Добавте отзыв о преподе"}
                    />
            </div>
        </>
);}


export default SinglePrepodPage;