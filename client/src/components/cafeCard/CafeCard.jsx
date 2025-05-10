import styles from "./cafeCard.module.css"
const CafeCard = ({props}) => {
    return (
        <div className={styles.wrapper}>
            <img src={props.image} alt="cafe image" className={styles.image} />
            <div className={styles.title}>
                {props.title}
            </div>
        </div>
    );
}

export default CafeCard;