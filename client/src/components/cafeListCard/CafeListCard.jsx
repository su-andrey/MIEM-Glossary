import styles from "./cafeListCard.module.css"
import getFiveScale from "../../custom hooks/useGetFiveScale";
import StarsDumb from "../UI/starsDumb/StarsDumb";
import getRandomImagePath from "../../custom hooks/helpers/getRandomImagePath";
const CafeListCard = ({data}) => {
    console.log(data)
    const getPhoto = () => {
        if (Array.isArray(data?.photos) && data.photos.length > 0) {
            return data.photos[0].url;
        }
        return getRandomImagePath();
    };

    console.log(data)
    return (
        <div className={styles.wrapper}>
            <img src={getPhoto()} alt="cafe image" className={styles.image} />
            <div className={styles.lower}>
                <div className={styles.title}>
                    {data.name || data.body || "ошибка загрузки"}
                </div>
                <div className={styles.gradeBlock}>
                    <StarsDumb defaultRating={getFiveScale(data)} iconSize="1.7vw"></StarsDumb>
                </div>
            </div>  
        </div>
    );
}

export default CafeListCard;