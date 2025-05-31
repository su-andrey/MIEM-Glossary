import StarsDumb from "../UI/starsDumb/StarsDumb";
import styles from "./review.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
import getFiveScale from "../../custom hooks/useGetFiveScale";
import { useEffect, useState } from "react";
import ReactionBlock from "../reactionBlock/ReacrionBlock";
import EditPostButton from "../UI/editPostButton/EditPostButton";
import DeletePostButton from "../UI/deletePostButton/DeletePostButton";
const Review = ({data}) => {
    const [name, setName] = useState("");
    useEffect(()=>{setName(useNameGenerator())}, []);
    return(
    <div className={styles.wrapper}>
        <div className={styles.name}>
            {data?.nothing || name}
        </div>
        <div className={styles.body}>
            {data.body}
        </div>
        <div className={styles.editBlock}>
            <EditPostButton oneField={true} data={data} iconSize="2vw"/>
            <DeletePostButton data={data} iconSize="2.5vw"/>
        </div>
    </div>
);}

export default Review;