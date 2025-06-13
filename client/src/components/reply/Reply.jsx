import styles from "./reply.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import getMe from "../../queries/USER/getMe";
import DeletePostButton from "../UI/deletePostButton/DeletePostButton";
import DeleteCommentButton from "../UI/deleteCommentButton/DeleteCommentButton";

const Reply = ({data, serv}) => {
    const [name, setName] = useState("");
    const [visible, setVisible] = useState(false)
    useEffect(()=>{setName(useNameGenerator())}, []);
    const [userID, setUserID] = useState(null)

    useEffect(()=>{
        const temp = getMe();
        if(temp.id == false || temp == false){
            setVisible(false)
        }
        else{
            setUserID(temp?.id)
            if (temp.is_admin === true){
                setVisible(true)
            }
            else if(userID == data.author_id){
                setVisible(true)
            }
        }
    }, [])
    

    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>
                {data.nothing || name}
            </div>
            <div className={styles.body}>
                {data.body}
            </div>
            <DeleteCommentButton
                data={data}
                iconSize="2.5vw"
            />
        </div>
);}

export default Reply;