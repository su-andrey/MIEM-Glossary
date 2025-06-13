import FileDragField from "./fileDragField/FileDragField";
import styles from "./postCreateField.module.css"
const PostCreateField = () => {
    return ( 
        <div className={styles.wrapper}>
            <FileDragField />
        </div>
    );
}

export default PostCreateField;