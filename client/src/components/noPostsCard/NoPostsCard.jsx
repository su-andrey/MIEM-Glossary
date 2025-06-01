
import styles from "./review.module.css"
const NoPostsCard = ({text}) => {
    return(
    <div className={styles.wrapper}>
        <div className={styles.name}>
            {text || "Тут пока ничего нет"}
        </div>
    </div>
);}

export default NoPostsCard;