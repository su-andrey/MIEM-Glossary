import styles from "./singleFoodPage.module.css"
import { useSelector } from "react-redux";
import { uid } from "uid";
import AnswerField from "../../../components/UI/answerField/AnswerField";
import {motion} from "framer-motion"
import { useParams } from "react-router-dom";
import Review from "../../../components/review/Review";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, FreeMode, Keyboard, Mousewheel, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Stars from "../../../components/UI/starsActive/Stars";
import useGetFiveScale from "../../../custom hooks/useGetFiveScale";
import image from "./../../../assets/jpg/cafe_categories/soup.jpg"
import getFoodReviewsByID from "../../../store/selectors/forSinglePages/getFoodReviewsByID";
import getPostsByID from "../../../store/selectors/getPostByID";
import Scroll from "../../../components/UI/scrollButton/Scroll";
import Loader from "../../../components/UI/loader/Loader";
import { useState, useEffect } from "react";
import createPost from "../../../queries/POST/createPost";
import { useDispatch } from "react-redux";
import { addPost } from "../../../store/mainSlice";
import getRandomImagePath from "../../../custom hooks/helpers/getRandomImagePath";
import CreateCommentModal from "../../../components/UI/createCommentModal/CreateCommentModal";
import updatePost from "../../../store/refreshers/updatePost";
import ReactionBlock from "../../../components/reactionBlock/ReactionBlock";
import { Navigate } from "react-router-dom";
import NoPostsCard from "../../../components/noPostsCard/NoPostsCard";


const SingleFoodPage = () => {
    let categoryID = useParams().category;
    let postID = (useParams().id);
    let authorID = useSelector(state => state.main.userID)
    const food = useSelector(state => getPostsByID(state, postID))
    const reviews = useSelector(state => getFoodReviewsByID(state, postID)) 
    let categories = useSelector(state => state.main.categories)
    let reviewCategory = categories.find((category) => category.name == "Отзывы");
    console.log("Полученные отзывы", reviews)
    const [ready, setReady] = useState(false);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        updatePost({dispatch, postID})
    }, [])

        const centerItemAnimation = {
        hidden: {
            opacity: 0,
            y: 100,
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
    
    const submitter = async ({ answer, category_id, author_id, post_id }) => {
        try {
            console.log({
                name: post_id,
                category_id: Number(category_id),
                author_id: author_id,
                body: answer,
            })
            const response = await createPost({
            name: post_id,
            category_id: Number(category_id),
            author_id: Number(author_id),
            body: answer,
            });
            console.log("Ответ серва при создании отзыва", response);
            dispatch(addPost(response));
        } 
        catch (error) {
            console.error("Ошибка добавления вопроса", error);
        }
    }

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
    if (!ready) return <Loader />;
    if (!food || food.id === undefined) {
        return <Navigate to={`/food/${categoryID}`} replace />;
    }
    return(
        <>
            <Scroll />
            <div className={styles.wrapper}>
                        <div className={styles.topContainer}>
                            <div className={styles.topWrapper}>
                                <div className={styles.logicalBlock}>
                                    <div className={styles.title}>
                                        {food.name}
                                    </div>
                                    <div className={styles.gradeBlock}>
                                        <ReactionBlock data={food} />
                                    </div>
                                </div>
                                <div className={styles.caption}>
                                    {food.body}
                                </div>
                                
                                <div className={styles.logicalBlock}>
                                    <div className={styles.caption} style={{color:"var(--light-grey)"}}>
                                        Выскажите свое мнение о заведении
                                    </div>
                                    <CreateCommentModal
                                        settings={{marginTop:'1vh'}}
                                        placeholder={"Поделитесь мнением?"}
                                        caption={"Добавте отзыв о заведении"}
                                        submitter={(answer) => submitter({answer, category_id: reviewCategory.id, author_id: authorID, post_id: postID  })}
                                    />
                                </div>
                            </div>
                            <div className={styles.imageContainer + " " + styles.imageContainer1}>
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
                                    {food?.photos && food?.photos.length > 0 ?
                                        (food.photos.map((photo)=>{
                                            return(
                                                <SwiperSlide key={uid()} className={styles.SwiperSlide}>
                                                    <img src={photo.url} className={styles.image}></img>
                                                </SwiperSlide>
                                            )
                                        }))
                                        :
                                        <SwiperSlide>
                                            <img src={getRandomImagePath()} className={styles.image}></img>
                                        </SwiperSlide>
                                    }
                                </Swiper>
                                <div className={styles.swiperButtonPrev}>
                                    <svg className={styles.swiperSVG} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                    </svg>
                                </div>
                                <div className={styles.swiperButtonNext}>
                                    <svg className={styles.swiperSVG} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                                    </svg>
                                </div>
                                <div className={styles.swiperPagination}></div>                                
                            </div>
                        </div>




                            <div className={styles.imageContainer + " " + styles.imageContainer2}>
                                <div className={styles.swiperButtonPrev2}>
                                    <svg className={styles.swiperSVG} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                    </svg>
                                </div>
                                <Swiper
                                    className={styles.swiper + " " + styles.swiper2}
                                    modules={[Navigation, Pagination, Parallax, FreeMode, Keyboard, Mousewheel, Autoplay]}
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
                        
                                >
                                    {food?.photos && food?.photos.length > 0 ?
                                        (food.photos.map((photo)=>{
                                            return(
                                                <SwiperSlide key={uid()} className={styles.SwiperSlide}>
                                                    <img src={photo.url} className={styles.image}></img>
                                                </SwiperSlide>
                                            )
                                        }))
                                        :
                                        <SwiperSlide>
                                            <img src={getRandomImagePath()} className={styles.image}></img>
                                        </SwiperSlide>
                                    }
                                </Swiper>
                                <div className={styles.swiperButtonNext2}>
                                    <svg className={styles.swiperSVG} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                                    </svg>
                                </div>
                                <div className={styles.swiperPagination}></div>                                
                            </div>


                            <div className={styles.imageContainer + " " + styles.imageContainer3 }>
                                <div className={styles.swiperButtonPrev2}>
                                    <svg className={styles.swiperSVG} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                    </svg>
                                </div>
                                <Swiper
                                    className={styles.swiper + " " + styles.swiper2}
                                    modules={[Navigation, Pagination, Parallax, FreeMode, Keyboard, Mousewheel, Autoplay]}
                                    slidesPerView={1}
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
                        
                                >
                                    {food?.photos && food?.photos.length > 0 ?
                                        (food.photos.map((photo)=>{
                                            return(
                                                <SwiperSlide key={uid()} className={styles.SwiperSlide}>
                                                    <img src={photo.url} className={styles.image}></img>
                                                </SwiperSlide>
                                            )
                                        }))
                                        :
                                        <SwiperSlide>
                                            <img src={getRandomImagePath()} className={styles.image}></img>
                                        </SwiperSlide>
                                    }
                                </Swiper>
                                <div className={styles.swiperButtonNext2}>
                                    <svg className={styles.swiperSVG} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                                    </svg>
                                </div>
                                <div className={styles.swiperPagination}></div>                                
                            </div>


                        <div className={styles.subwrapper}>
                                <div className={styles.subtitle}>
                                    Отзывы:
                                </div>
                                <div className={styles.gridWrapper}>
                                    {reviews.length > 0 ?
                                        reviews.map((review, index)=>{
                                            return(
                                                <motion.div
                                                    custom={index%3}
                                                    variants={centerItemAnimation}
                                                    initial="hidden"
                                                    whileInView="visible"
                                                    viewport={{ once: true, amount: 0.5 }}
                                                    className={styles.element}
                                                    key={review.id}
                                                    style={{
                                                        width:"max-content",
                                                        height: "stretch"
                                                    }}
                                                >
                                                    <Review data={review}></Review>
                                                </motion.div>
                                                
                                            );
                                        })
                                        :
                                        <NoPostsCard text="Пока нет отзывов..."/>
                                    }
                                </div>
                    </div>
            </div>
        </>
);}


export default SingleFoodPage;