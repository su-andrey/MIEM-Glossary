import styles from "./prepodCard.module.css"
import getFiveScale from "../../custom hooks/useGetFiveScale";
import StarsDumb from "../UI/starsDumb/StarsDumb";
import soup from "./../../assets/jpg/cafe_categories/soup.jpg"
const PrepodCard = ({data}) => {
    return (
        <div className={styles.wrapper}>
            <img src={data.image || soup} alt="cafe image" className={styles.image} />
            <div className={styles.lower}>
                <div className={styles.title}>
                    {data.name || "ошибка загрузки"}
                </div>
                <div className={styles.gradeBlock}>
                    <div className={styles.grade}>
                        {getFiveScale(data, 1)}
                    </div>
                    <StarsDumb defaultRating={getFiveScale(data)} iconSize="1.7vw"></StarsDumb>
                </div>
            </div>  
        </div>
    );
}

export default PrepodCard;