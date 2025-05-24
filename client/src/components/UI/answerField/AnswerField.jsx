import ActionButton from "../actionButton/ActionButton";
import styles from "./answerField.module.css"
const AnswerField = ({height, width, placeholder, caption, settings, submitter}) => {
    return (<>
    <div className={styles.wrapper} style={settings}>
        <form className={styles.fieldForm} onSubmit={submitter()}>
            <div className={styles.caption}>{caption || "Добавьте собственное заведение или отзыв"}</div>
            <textarea  
                placeholder={placeholder || "Добавить ответ..."}
                className={styles.field}
                name="answer"
                style={{
                    height: (height || "25vh"),
                    width: (width || "30vw"),
                }}
            />
            <ActionButton text="Отправить"></ActionButton>
        </form>
        
    </div>
    </>);
}

export default AnswerField;