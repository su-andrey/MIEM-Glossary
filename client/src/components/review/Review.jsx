import StarsDumb from "../UI/starsDumb/StarsDumb";
import styles from "./review.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
import getFiveScale from "../../custom hooks/useGetFiveScale";
import { useEffect, useState } from "react";
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
    </div>
);}

export default Review;