import styles from "./foodCataloguePage.module.css";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uid } from "uid";
import { Swiper, SwiperSlide } from 'swiper/react';
import nothing from "./../../assets/jpg/nothing/nothing.jpeg"
import { Navigation, Pagination, Autoplay, Parallax, FreeMode, Keyboard, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ActionButton from "../../components/UI/actionButton/ActionButton";
import waitForImagesToLoad from "./../../custom hooks/helpers/waitForImagesToLoad"
import getPostsByCategoryID from "../../store/selectors/getPostsByCategoryID";
import getCategories from "../../store/selectors/getCategories";
import CafeListCard from "../../components/cafeListCard/CafeListCard";
import SearchField from "../../components/UI/searchField/SearchField";
import AnswerField from "../../components/UI/answerField/AnswerField";
import Loader1 from "../../components/UI/loader1/Loader1";
import AppLoaderWrapper from "../appLoaderWarapper/AppLoaderWrapper";
import FileDragField from "../../components/UI/postCreateField/fileDragField/FileDragField";
import createPost from "../../queries/POST/createPost";
import createPhotos from "../../queries/POST/createPhotos";
import requirePosts from "../../queries/GET/requirePosts";
import { addPost, setChanged } from "../../store/mainSlice";
import getRandomImagePath from "../../custom hooks/helpers/getRandomImagePath";
import CreatePostModal from "../../components/UI/createPostModal/CreatePostModal";

const FoodCataloguePage = () => {
    const dispatch = useDispatch();
    const [isSliderReady, setSliderReady] = useState(false);
    const { category } = useParams();
    console.log(category)
    const posts = useSelector(state => getPostsByCategoryID(state, category));
    const uathorID = useSelector(state => state.main.userID)
    const categories = useSelector(state => getCategories(state));
    const currentCategory = categories.find(categoryEl => categoryEl.id == category);
    const [ready, setReady] = useState(false);
    const author_id = useSelector(state => state.main.userID)

    useEffect(()=>{
        dispatch(setChanged(true))
    }, [])

    const sendWholeData = async ({answer, name, photos, author_id, category_id}) => {
        try{
            console.log("sending this to the server:", {name, body: answer, author_id, category_id})
            const response = await createPost({name, body: answer, author_id, category_id})
            await createPhotos({photos, id: response.id})
            const final_post = await requirePosts(response.id)
            console.log("final cafe post", final_post)
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
        <AppLoaderWrapper>
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.textWrapper}>
                        <div className={styles.title}>{currentCategory.name}</div>
                        <div className={styles.caption}>
                            Выберите интересующее заведение
                        </div>
                    </div>
                    <div className={styles.buttonWrapper}>
                            <div className={styles.caption}>
                                Предложите что-то еще
                            </div>
                            {author_id &&
                                <CreatePostModal 
                                    placeholder="Предложить заведение..."
                                    caption="Забыли что-то? Напомните нам"
                                    sender={({answer, name, photos})=>sendWholeData({answer, name, photos, author_id: author_id, category_id: currentCategory.id})}
                                />
                            }
                            {!author_id &&
                                <div className={styles.subcont}>
                                    <div className={styles.caption}>Войдите в аккаунт чтобы добавлять посты</div>
                                    <Link to="/login"><ActionButton text="Авторизоваться"/></Link>
                                </div>
                            }
                    </div>
                </div>

                {isSliderReady ? <div className={styles.sliderWrapper}>
                        {posts?.length > 0 ? (
                            posts.map((post) => (
                                    <Link key={uid()} to={`/food/${category}/${post.id}`}>
                                        <CafeListCard data={post} />
                                    </Link>
                            ))
                        ) : (
                            <CafeListCard data={{name:"Пока тут пусто"}} />
                        )}
                </div>
                :
                <Loader1 />
                }
                {author_id &&
                        <div className={styles.subcont}>
                            <div className={styles.caption}>Добавте свое заведение</div>
                            <CreatePostModal 
                                placeholder="Предложить заведение..."
                                caption="Забыли что-то? Напомните нам"
                                sender={({answer, name, photos})=>sendWholeData({answer, name, photos, author_id: author_id, category_id: currentCategory.id})}
                            />
                        </div>

                }
                {!author_id && 
                        <div className={styles.subcont}>
                            <div className={styles.caption}>Войдите в аккаунт чтобы добавлять посты</div>
                            <Link to="/login"><ActionButton text="Авторизоваться"/></Link>
                        </div>
                }
            </div>
        </AppLoaderWrapper>
    );
};

export default FoodCataloguePage;