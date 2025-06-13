import styles from "./prepodPage.module.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uid } from "uid";
import { useState, useEffect } from "react";

import getPostsByCategory from "../../store/selectors/getPostsByCategoryID";
import getCategories from "../../store/selectors/getCategories";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import PrepodCard from "../../components/prepodCard/PrepodCard";
import Loader from "../../components/UI/loader/Loader";
import Loader1 from "../../components/UI/loader1/Loader1";
import FileDragField from "../../components/UI/postCreateField/fileDragField/FileDragField";
import createPost from "../../queries/POST/createPost";
import createPhotos from "../../queries/POST/createPhotos";
import { addPost, setChanged } from "../../store/mainSlice";
import requirePosts from "../../queries/GET/requirePosts";
import ActionButton from "../../components/UI/actionButton/ActionButton";
import CreatePostModal from "../../components/UI/createPostModal/CreatePostModal";
import AppLoaderWrapper from "../appLoaderWarapper/AppLoaderWrapper";
import refreshStorage from "../../store/refreshers/refreshStorage";
import getModeratedCategoryPosts from "../../store/selectors/moderation/getModeratedCategoryPosts";
const PrepodPage = () => {
    const dispatch = useDispatch(addPost)
    const [isSliderReady, setSliderReady] = useState(false);
    const categories = useSelector(state => getCategories(state));
    const category = categories.find((category) => category.name == "Преподаватели");
    const posts = useSelector(state => getModeratedCategoryPosts(state, category.id));
    const author_id = useSelector(state => state.main.userID)
    //console.log(posts)
    const [ready, setReady] = useState(false);

    useEffect(()=>{
        refreshStorage(dispatch)
    }, [])

    const sendWholeData = async ({answer, name, photos, author_id, category_id}) => {
        try{
            //console.log("sending this to the server:", {name, body: answer, author_id, category_id})
            const response = await createPost({name, body: answer, author_id, category_id})
            const photots_answer = await createPhotos({photos, id: response.id})
            const final_post = await requirePosts(response.id)
            //console.log(final_post)
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
        <AppLoaderWrapper >
        <div className={styles.wrapper}>
            <div className={styles.topWrapper}>
                <div className={styles.textWrapper}>
                    <div className={styles.title}>Преподы</div>
                    <div className={styles.caption}>
                        Выберите интересующего преподавателя
                    </div>
                </div>
                <div className={styles.buttonWrapper + " " + styles.support}>
                        <div className={styles.caption}>
                            Предложите кого-то еще
                        </div>
                        {author_id &&
                            <CreatePostModal 
                                placeholder="Предложить препода..."
                                caption="Забыли кого-то? Напомните нам"
                                sender={({answer, name, photos})=>sendWholeData({answer, name, photos, author_id: author_id, category_id: category.id})}
                            />
                        }
                        {!author_id &&
                            <div className={styles.support}>
                                <div className={styles.caption}>Войдите в аккаунт чтобы добавлять посты</div>
                                <Link to="/login"><ActionButton text="Авторизоваться"/></Link>
                            </div>
                        }
                </div>
            </div>
            {isSliderReady ? 
            <div className={styles.sliderWrapper}>
                        {posts && posts.length > 0 ?
                        (posts?.map((post) => (
                                <Link to={`/prepods/${post.id}`} key={post.id}>
                                    <PrepodCard data={post} />
                                </Link>
                        )))
                        :
                        <PrepodCard data={{name:"Пока тут никого"}} />
                        }
                </div>
                :
                <Loader1 />
            }
            {author_id &&
                        <div className={styles.subcont}>
                            <div className={styles.caption}>Добавьте свое заведение</div>
                            <CreatePostModal 
                                placeholder="Предложить заведение..."
                                caption="Забыли что-то? Напомните нам"
                                sender={({answer, name, photos})=>sendWholeData({answer, name, photos, author_id: author_id, category_id: category.id})}
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
}

export default PrepodPage;