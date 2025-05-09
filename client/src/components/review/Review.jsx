import StarsDumb from "../UI/starsDumb/StarsDumb";
import styles from "./review.module.css"
const Review = () => {
    return(
    <div className={styles.wrapper}>
        <div className={styles.topBlock}>
            <div className={styles.name}>
            
            </div>
            <div className={styles.gradeBlock}>
                <div className={styles.grade}>
                
                </div>
                <StarsDumb></StarsDumb>
            </div>  
        </div>
    </div>
);}

export default Review;