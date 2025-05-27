import ActionButton from "../../actionButton/ActionButton";
import styles from "./fileDragField.module.css"
import { useState } from "react";
import { uid } from "uid";
import { useRef } from "react";
import { IoMdPhotos } from "react-icons/io";
import { MdCloudUpload } from "react-icons/md";
const FileDragField = ({height, width, placeholder, caption, settings, sender, opener}) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploaded, setUploaded] = useState();
    const [answer, setAnswer] = useState("");
    const [name, setName] = useState("");
    const [packedAnswer, setPackedAnswer] = useState(null);
    const [status, setStatus] = useState("idle");
    const [drag, setDrag] = useState(false);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const packed = {
            answer,
            name,
            photos: selectedFiles,
        };
        sender(packed);
        console.log(packed);
        setAnswer(""); 
        setName("");
        setSelectedFiles([]);
        opener(false);
    };

    const handleFileChange = (e) => {
        console.log(e.target.files)
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
            <input  
                placeholder={"Добавить имя..."}
                className={styles.field}
                name="name"
                style={{
                    height: (height || "8vh"),
                    width: (width || "30vw"),
                }}
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea  
                placeholder={placeholder || "Добавить ответ..."}
                className={styles.field}
                name="answer"
                style={{
                    height: (height || "25vh"),
                    width: (width || "30vw"),
                }}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
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
            <ActionButton text="Отправить" type="submit"></ActionButton>
        </form>
        
    </div>
    </>);
}

export default FileDragField;