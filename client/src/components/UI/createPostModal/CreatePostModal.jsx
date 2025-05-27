import styles from "./createPostModal.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useState, useEffect } from "react";
import { uid } from "uid";
import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { useSelector } from "react-redux";
import FileDragField from "../postCreateField/fileDragField/FileDragField";

const CreatePostModal = ({height, width, placeholder, caption, settings, sender}) => {
    
    const [open, setOpen] = useState();
    let userID = useSelector(state => state.main.userID)

    const handleClose = () => {
        setOpen(false)
    }

    const handleRedirect = ()=>{
        navigate("/login", { state: { from: location } });
    }
    
    return ( 
        <>
            <ActionButton text="Добавить" onClick={()=>{setOpen(true)}}/>
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

export default CreatePostModal;