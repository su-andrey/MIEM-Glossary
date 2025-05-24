import styles from "./cafeCard.module.css"
import nothing from "./../../assets/jpg/nothing/nothing.jpeg"
import getRandomImagePath from "../../custom hooks/helpers/getRandomImagePath";
const CafeCard = ({data}) => {
    return (
        <div className={styles.wrapper}>
            <img src={data.image || getRandomImagePath() || nothing} alt="cafe image" className={styles.image} />
            <div className={styles.title}>
                {data.name}
            </div>
        </div>
    );
}

export default CafeCard;