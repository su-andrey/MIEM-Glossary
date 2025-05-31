import styles from "./singlePrepodPage.module.css"
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import createPost from "../../../queries/POST/createPost";
import Question from "../../../components/question/Question";
import ActionButton from "../../../components/UI/actionButton/ActionButton";
import { Link } from "react-router-dom";
import { uid } from "uid";
import AnswerField from "../../../components/UI/answerField/AnswerField";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Parallax, FreeMode, Keyboard, Mousewheel, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import {motion} from "framer-motion"
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
import Loader1 from "../../../components/UI/loader1/Loader1";
import { addPost } from "../../../store/mainSlice";
import getRandomImagePath from "../../../custom hooks/helpers/getRandomImagePath";
import CreateCommentModal from "../../../components/UI/createCommentModal/CreateCommentModal";
import StarsDumb from "../../../components/UI/starsDumb/StarsDumb";
import GradeModal from "../../../components/UI/gradeModal/GradeModal";
import requirePosts from "../../../queries/GET/requirePosts";
import ReactionBlock from "../../../components/reactionBlock/ReacrionBlock";
import updatePost from "../../../store/refreshers/updatePost";
import NoPostsCard from "../../../components/noPostsCard/NoPostsCard";
import { Navigate } from "react-router-dom";

const SinglePrepodPage = () => {
    const dispatch = useDispatch();
    let categories = useSelector(state => getCategories(state));
    let category = categories.find((category) => category.name == "Преподаватели");
    let reviewCategory = categories.find((category) => category.name == "Отзывы");
    let authorID = useSelector(state => state.main.userID)
    let posts = useSelector(state => getPostsByCategory(state, category.id));
    const post_id = (useParams().id);
    let prepod = useSelector(state => getPrepodByID(state, post_id))

    useEffect(()=>{
        updatePost({dispatch, postID: post_id})
    }, [])
/*
    useEffect(()=>{
        const getPost = async ()=>{
            try{
                let prepodus = await requirePosts(post_id)
                setPrepod(prepodus)
            }
            catch(error){
                console.error(error)
            }
        }
        getPost()
    }, [])
*/

    const reviews = useSelector(state => getPrepodReviewsByID(state, post_id))
    const [ready, setReady] = useState(false);
    const [gradeModalOpened, setModalOpened] = useState(false);

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


    const submitter = async ({ answer, category_id, author_id, post_id }) => {
        try {
            const response = await createPost({
            name: post_id,
            category_id: category_id,
            author_id: author_id,
            body: answer,
            });
            console.log("Ответ серва при создании отзыва", response);
            dispatch(addPost(response));
        } 
        catch (error) {
            console.error("Ошибка добавления вопроса", error);
        }
    }

    if (!prepod || prepod.id === undefined) {
        return <Navigate to={`/prepods`} replace />;
    }
    if (!ready) return <Loader1/>;
    return(
        <>
            <Scroll />
            <div className={styles.wrapper}>
                        <div className={styles.topContainer}>
                            <div className={styles.topWrapper}>
                                <div className={styles.logicalBlock}>
                                    <div className={styles.title}>
                                        {prepod.name}
                                    </div>
                                    <div  onClick={()=>{setModalOpened(true)}} className={styles.gradeBlock}>
                                        <div className={styles.grade}>
                                            <ReactionBlock data={prepod}/>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className={styles.caption}>
                                    {prepod.body}
                                </div>
                                
                                <div className={styles.logicalBlock}>
                                    <div className={styles.caption} style={{color:"var(--light-grey)"}}>
                                        Выскажите свое мнение о преподе
                                    </div>
                                    <CreateCommentModal
                                        settings={{marginTop:'1vh'}}
                                        placeholder={"Поделитесь мнением?"}
                                        caption={"Добавте отзыв о преподе"}
                                        submitter={(answer) => submitter({answer, category_id: reviewCategory.id, author_id: authorID, post_id: post_id  })}
                                    />
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
                                    {prepod?.photos && prepod?.photos.length > 0 ?
                                        (prepod.photos.map((photo)=>{
                                            return(
                                                <SwiperSlide key={uid()}>
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


export default SinglePrepodPage;