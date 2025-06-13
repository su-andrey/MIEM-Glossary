import styles from "./loader1.module.css";

const Loader1 = () => {
    return (
        <div className={styles.background}>
            <div className={styles.wrapper}>
                <div className={styles.loader1}></div>
            </div>
        </div>
    );
};

export default Loader1;