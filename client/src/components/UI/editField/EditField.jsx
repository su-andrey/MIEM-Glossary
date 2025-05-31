import styles from "./editField.module.css"
import trash from "./../../../assets/vectors/edit/delete.svg"
import edit from "./../../../assets/vectors/edit/edit.svg"
import EditPostModal from "../editPostModal/EditPostModal";
const EditField = () => {
    return (
    <div className={styles.wrapper}>
        <EditPostModal 
            height={height} 
            width={width}
            placeholder={placeholder}
            caption={caption}
            settings={settings}
            sender={sender}
            opener = {setOpen}
        />
    </div>);
}

export default EditField;