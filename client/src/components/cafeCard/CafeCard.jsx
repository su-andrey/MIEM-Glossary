import styles from "./cafeCard.module.css"
const CafeCard = ({data}) => {
    return (
        <div className={styles.wrapper}>
            <img src={data.image} alt="cafe image" className={styles.image} />
            <div className={styles.title}>
                {data.name}
            </div>
        </div>
    );
}

export default CafeCard;