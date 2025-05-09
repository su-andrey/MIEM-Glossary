import styles from "./reply.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
const Reply = ({data}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>
                {useNameGenerator()}
            </div>
            <div className={styles.body}>
                {data.body}
            </div>
        </div>
);}

export default Reply;