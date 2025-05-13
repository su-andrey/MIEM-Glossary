import styles from "./prepodPage.module.css"
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { uid } from "uid";

import getPostsByCategory from "../../store/selectors/getPostsByCategoryID";
import getCategories from "../../store/selectors/getCategories";
import CafeListCard from "../../components/cafeListCard/CafeListCard";
import SearchField from "../../components/UI/searchField/SearchField";
import AnswerField from "../../components/UI/answerField/AnswerField";
import PrepodCard from "../../components/prepodCard/PrepodCard";
const PrepodPage = () => {
    let categories = useSelector(state => getCategories(state))
    let category = categories.find((category) => category.name == "Препод")
    let posts = useSelector(state => getPostsByCategory(state, category.category_id))
    
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.textWrapper}>
                        <div className={styles.title}>
                            Преподы
                        </div>
                        <div className={styles.caption}>
                            Выберите интересующего преподавателя
                        </div>
                    </div>
                </div>
                    <div className={styles.container} style={{marginBottom: "calc(1.5*var(--page-main-padding))"}}>
                        {posts.map((post)=>{
                            return(
                                <Link key={uid()} to={`/prepods/${post.post_id}`}>
                                    <CafeListCard data={post}/>
                                </Link>
                            );
                        })}
                    </div>
                    <AnswerField />
                </div>
        </>
);}

export default PrepodPage;