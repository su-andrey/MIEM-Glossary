import styles from "./prepodCard.module.css"
import getFiveScale from "../../custom hooks/useGetFiveScale";
import StarsDumb from "../UI/starsDumb/StarsDumb";
import getRandomImagePath from "../../custom hooks/helpers/getRandomImagePath";
const PrepodCard = ({data}) => {
    console.log(data)
    const getPhoto = () => {
            if (Array.isArray(data?.photos) && data.photos.length > 0) {
                return data.photos[0].url;
            }
            return getRandomImagePath();
        };
    return (
        <div className={styles.wrapper}>
            <img src={getPhoto() || getRandomImagePath()} alt="cafe image" className={styles.image} />
            <div className={styles.lower}>
                <div className={styles.title}>
                    {data.name || "ХЗ как его зовут"}
                </div>
                <div className={styles.gradeBlock}>
                    <StarsDumb defaultRating={getFiveScale(data)} iconSize="1.7vw"></StarsDumb>
                </div>
            </div>  
        </div>
    );
}

export default PrepodCard;