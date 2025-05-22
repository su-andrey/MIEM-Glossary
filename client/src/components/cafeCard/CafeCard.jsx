import styles from "./cafeCard.module.css"
import nothing from "./../../assets/jpg/nothing/nothing.jpeg"
const CafeCard = ({data}) => {
    return (
        <div className={styles.wrapper}>
            <img src={data.image || nothing} alt="cafe image" className={styles.image} />
            <div className={styles.title}>
                {data.name}
            </div>
        </div>
    );
}

export default CafeCard;