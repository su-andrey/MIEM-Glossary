import styles from "./questionPage.module.css"
import { useSelector } from "react-redux";
import getCategories from "../../store/selectors/getCategories";
import getPostsByCategory from "../../store/selectors/getPostsByCategoryID";
import Question from "../../components/question/Question";
import { Link } from "react-router-dom";
import { uid } from "uid";
import AnswerField from "../../components/UI/answerField/AnswerField";
const QuestionPage = () => {
    let categories = useSelector(state => getCategories(state))
    let category = categories.find((category) => category.name == "Препод")
    let questions = useSelector(state => getPostsByCategory(state, category.category_id))
    return(
        <>
            <div className={styles.wrapper}>
                <div className={styles.topWrapper}>
                    <div className={styles.textWrapper}>
                        <div className={styles.title}>
                            Вопросы и ответы
                        </div>
                        <div className={styles.caption}>
                            Выберите интересующую тему
                        </div>
                    </div>
                </div>
                    <div className={styles.container} style={{marginBottom: "calc(1.5*var(--page-main-padding))"}}>
                        {questions.map((post)=>{
                            return(
                                <Link key={uid()} to={`/questions/${post.post_id}`}>
                                    <Question data={post}/>
                                </Link>
                            );
                        })}
                    </div>
                    <AnswerField />
                </div>
        </>
);}


export default QuestionPage;