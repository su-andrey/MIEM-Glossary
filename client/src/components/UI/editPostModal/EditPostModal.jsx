import styles from "./editPostModal.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useState, useEffect } from "react";
import { uid } from "uid";
import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { useSelector } from "react-redux";
import FileDragField from "../postCreateField/fileDragField/FileDragField";
import edit from "./../../../assets/vectors/edit/edit.svg"
const EditPostModal = ({height, width, placeholder, caption, settings, sender}) => {
    
    const [open, setOpen] = useState(false);

    let userID = useSelector(state => state.main.userID)

    const handleClose = () => {
        setOpen(false)
    }
    
    return ( 
        <>
            <img src={edit} alt="edit button" className={styles.edit}/>
            {open && <div className={styles.background}>
                <div className={styles.wrapper}>
                    <MdOutlineCancel className={styles.cancel} onClick={()=>{handleClose()}} />
                    <div className={styles.title}>Создание поста</div>
                    {userID && 
                        <FileDragField 
                        height={height} 
                        width={width}
                        placeholder={placeholder}
                        caption={caption}
                        settings={settings}
                        sender={sender}
                        opener = {setOpen}
                        />
                    }
                    {!userID && 
                        <div className={styles.subtitle}>Зарегистрируйтесь, чтобы добавлять посты, комментировать и оставлять реакции</div>
                    }
                </div>
            </div>}
        </>
    );
}

export default EditPostModal;