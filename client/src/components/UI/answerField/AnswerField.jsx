import ActionButton from "../actionButton/ActionButton";
import styles from "./answerField.module.css"
import { useState } from "react";
const AnswerField = ({height, width, placeholder, caption, settings, submitter}) => {
    const [answer, setAnswer] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        submitter(answer); 
        setAnswer(""); 
    };
    return (<>
    <div className={styles.wrapper} style={settings}>
        <form className={styles.fieldForm} onSubmit={()=>handleSubmit()}>
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
            <ActionButton text="Отправить" type="submit"></ActionButton>
        </form>
        
    </div>
    </>);
}

export default AnswerField;