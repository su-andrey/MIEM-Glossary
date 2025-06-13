import ActionButton from "../actionButton/ActionButton";
import styles from "./answerField.module.css"
import { useState } from "react";
const AnswerField = ({height, width, placeholder, caption, settings, submitter, opener}) => {
    const [answer, setAnswer] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        submitter(answer); 
        setAnswer(""); 
        opener(false);
    };
    return (<>
    <div className={styles.wrapper} style={settings}>
        <form className={styles.fieldForm} onSubmit={handleSubmit}>
            <div className={styles.subContainer}>
                <div className={styles.caption}>{caption || "Выразите ваше мнение по этому вопросу"}</div>
                <textarea
                    placeholder={placeholder || "Добавить ответ..."}
                    className={styles.field}
                    name="answer"
                    style={{
                        height: (height || ""),
                        width: (width || ""),
                    }}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </div>
            <ActionButton text="Отправить" type="submit" reload={true}></ActionButton>
        </form>
        
    </div>
    </>);
}

export default AnswerField;