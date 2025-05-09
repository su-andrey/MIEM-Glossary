import StarsDumb from "../UI/starsDumb/StarsDumb";
import styles from "./review.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
const Review = ({data}) => {
    const getFiveScale = (data)=>{
        return Math.round(5*(data.likes/(data.likes+data.dislikes)))
    }
    return(
    <div className={styles.wrapper}>
        <div className={styles.topBlock}>
            <div className={styles.name}>
                {useNameGenerator()}
            </div>
            <div className={styles.gradeBlock}>
                <div className={styles.grade}>
                    {getFiveScale(data)}.0
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