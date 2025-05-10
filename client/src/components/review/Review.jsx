import StarsDumb from "../UI/starsDumb/StarsDumb";
import styles from "./review.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
import getFiveScale from "../../custom hooks/useGetFiveScale";
const Review = ({data}) => {
    return(
    <div className={styles.wrapper}>
        <div className={styles.topBlock}>
            <div className={styles.name}>
                {useNameGenerator()}
            </div>
            <div className={styles.gradeBlock}>
                <div className={styles.grade}>
                    {getFiveScale(data, 1)}
                </div>
                <StarsDumb defaultRating={getFiveScale(data)} iconSize="1.7vw"></StarsDumb>
            </div>  
        </div>
        <div className={styles.body}>
            {data.body}
        </div>
    </div>
);}

export default Review;