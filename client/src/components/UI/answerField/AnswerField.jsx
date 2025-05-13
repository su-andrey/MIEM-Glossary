import ActionButton from "../actionButton/ActionButton";
import styles from "./answerField.module.css"
const AnswerField = () => {
    return (<>
    <div className={styles.wrapper}>
        <form className={styles.fieldForm}>
            <div className={styles.caption}>Добавьте собственное заведение или отзыв</div>
            <textarea  
                placeholder="Добавить ответ..." 
                className={styles.field}
                rows={6}
            />
            <ActionButton text="Отправить"></ActionButton>
        </form>
        
    </div>
    </>);
}

export default AnswerField;