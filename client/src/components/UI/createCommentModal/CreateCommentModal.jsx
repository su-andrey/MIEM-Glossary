import styles from "./createCommentModal.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useState, useEffect } from "react";
import { uid } from "uid";
import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import { useSelector } from "react-redux";
import AnswerField from "../answerField/AnswerField";
import { Link } from "react-router-dom";
const CreateCommentModal = ({height, width, placeholder, caption, settings, submitter}) => {
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
                    <div className={styles.title}>Добавление комментария</div>
                    {userID && 
                        <AnswerField
                        settings={settings}
                        width={width} 
                        height={height}
                        placeholder={placeholder}
                        caption={caption}
                        submitter={submitter}
                        opener = {setOpen}
                        />
                    }
                    {!userID && 
                        <>
                            <div className={styles.caption}>Войдите в аккаунт чтобы добавлять комментарии</div>
                            <Link to="/login"><ActionButton text="Авторизоваться"/></Link>
                        </>
                    }
                </div>
            </div>}
        </>
    );
}

export default CreateCommentModal;