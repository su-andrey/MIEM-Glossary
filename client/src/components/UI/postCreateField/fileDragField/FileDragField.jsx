import ActionButton from "../../actionButton/ActionButton";
import styles from "./fileDragField.module.css"
import { useState } from "react";
import { uid } from "uid";
import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
import updatePost from "../../../../store/refreshers/updatePost";
import { useDispatch } from "react-redux";
const FileDragField = ({height, width, placeholder, caption, settings, sender, opener, data, oneField}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploaded, setUploaded] = useState();
    const [answer, setAnswer] = useState(data?.body || "");
    const [name, setName] = useState(data?.name || "");
    const [packedAnswer, setPackedAnswer] = useState(null);
    const [status, setStatus] = useState("idle");
    const [drag, setDrag] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const packed = {
            answer,
            name,
            photos: selectedFiles,
        };
        await sender(packed);
        //console.log(packed);
        setAnswer(""); 
        setName("");
        setSelectedFiles([]);
        await updatePost({dispatch, postID: data?.id})
        opener(false);
        window.location.reload();
    };

    const handleFileChange = (e) => {
        //console.log(e.target.files)
        setSelectedFiles(Array.from(e.target.files));
    }

    const dragStartHandler = (e)=>{
        e.preventDefault()
        setDrag(true)
    }   

    const dragLeaveHandler = (e)=>{
        e.preventDefault()
        setDrag(false)
    }   

    const handleClickOnDropArea = () => {
        fileInputRef.current.click();
    };

    const onDropHandler = (e)=>{
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles(prev => [...prev, ...files]);
        setDrag(false);
    }

    return (<>
    <div className={styles.wrapper} style={settings}>
        <form className={styles.fieldForm} onSubmit={handleSubmit}>
            <div className={styles.caption}>{caption || "Добавьте собственное заведение или отзыв"}</div>
            
            { !oneField && <input  
                placeholder={"Добавить имя..."}
                className={styles.input}
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />}
            <textarea  
                placeholder={placeholder || "Добавить ответ..."}
                className={styles.field}
                name="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
            { 
                !oneField && 
                <>
                    <input 
                        type="file"
                        multiple
                        ref={fileInputRef}
                        accept="image/*, .png, .jpg, .jpeg, .webp"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                    >
                    </input>
                    <div 
                        className={drag ? styles.leaveField : styles.dragField}
                        onDragStart={e => dragStartHandler(e)}
                        onDragLeave={e => dragLeaveHandler(e)}
                        onDragOver={e => dragStartHandler(e)}
                        onDrop={e => onDropHandler(e)}
                        onClick={handleClickOnDropArea}
                    >
                        {drag ? 
                            <MdCloudUpload style={{width:"12%", color:"var(--dark-grey)"}}/>
                            :
                            <IoMdPhotos style={{width:"12%", color:"var(--dark-grey)"}}/>
                        }
                    </div>
                </>
            }
            {
                selectedFiles.length > 0 
                &&
                selectedFiles.map((file)=>{
                    return(
                        <div key={uid()}>
                            <div>File name: {file.name}</div>
                        </div>
                    )
                })
            }
            <ActionButton text="Отправить" type="submit" reload={true}></ActionButton>
        </form>
        
    </div>
    </>);
}

export default FileDragField;