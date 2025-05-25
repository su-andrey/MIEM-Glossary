import styles from "./prepodPage.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import Loader1 from "../../components/UI/loader1/Loader1";
import FileDragField from "../../components/UI/postCreateField/fileDragField/FileDragField";
import createPost from "../../queries/POST/createPost";
import createPhotos from "../../queries/POST/createPhotos";
import { addPost } from "../../store/mainSlice";
import requirePosts from "../../queries/GET/requirePosts";
import ActionButton from "../../components/UI/actionButton/ActionButton";
const PrepodPage = () => {
    const dispatch = useDispatch(addPost)
    const [isSliderReady, setSliderReady] = useState(false);
    const categories = useSelector(state => getCategories(state));
    const category = categories.find((category) => category.name == "Преподаватели");
    const posts = useSelector(state => getPostsByCategory(state, category?.id));
    const author_id = useSelector(state => state.main.userID)
    console.log(posts)
    const [ready, setReady] = useState(false);

    const sendWholeData = async ({answer, name, photos, author_id, category_id}) => {
        try{
            console.log("sending this to the server:", {name, body: answer, author_id, category_id})
            const response = await createPost({name, body: answer, author_id, category_id})
            const photots_answer = await createPhotos({photos, id: response.id})
            const final_post = await requirePosts(response.id)
            console.log(final_post)
            dispatch(addPost(final_post))
        }
        catch(error){
            console.error(error)
        }
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
            setSliderReady(true)
        } else {
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);
    if (!ready) return <Loader1/>;
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
            {isSliderReady ? 
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
                        {posts && posts.length > 0 ?
                        (posts?.map((post) => (
                            <SwiperSlide key={uid()}>
                                <Link to={`/prepods/${post.id}`}>
                                    <PrepodCard data={post} />
                                </Link>
                            </SwiperSlide>
                        )))
                        :
                        <PrepodCard data={{name:"Пока тут никого"}} />
                        }
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
            {author_id &&
                <FileDragField 
                    placeholder="Предложить препода..."
                    caption="Забыли кого-то? Напомните нам"
                    sender={({answer, name, photos})=>sendWholeData({answer, name, photos, author_id: author_id, category_id: category.id})}
                />
            }
            {!author_id &&
                <>
                    <div className={styles.caption}>Войдите в аккаунт чтобы добавлять посты</div>
                    <Link to="/login"><ActionButton text="Авторизоваться"/></Link>
                </>
                
            }
            
        </div>
    );
}

export default PrepodPage;