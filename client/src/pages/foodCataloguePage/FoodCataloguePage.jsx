import styles from "./foodCataloguePage.module.css"
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { uid } from "uid";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import getPostsByCategory from "../../store/selectors/getPostsByCategoryID";
import getCategories from "../../store/selectors/getCategories";
import CafeListCard from "../../components/cafeListCard/CafeListCard";
import SearchField from "../../components/UI/searchField/SearchField";
import AnswerField from "../../components/UI/answerField/AnswerField";
const FoodCataloguePage = () => {
    
    const {category} = useParams()
    let posts = useSelector(state => getPostsByCategory(state, category))
    let categories = useSelector(state => getCategories(state))
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.textWrapper}>
                        <div className={styles.title}>
                            {categories.find(categoryEl => categoryEl.category_id == category).name}
                        </div>
                        <div className={styles.caption}>
                            Выберите интересующее заведение
                        </div>
                    </div>
                    <SearchField />
                </div>
                    <div className={styles.container} style={{marginBottom: "calc(1.5*var(--page-main-padding))"}}>
                        {posts.map((post)=>{
                            return(
                                <Link key={uid()} to={`/food/${category}/${post.post_id}`}>
                                    <CafeListCard data={post}/>
                                </Link>
                            );
                        })}
                    </div>
                    <AnswerField />
                </div>
        </>
);}

export default FoodCataloguePage;