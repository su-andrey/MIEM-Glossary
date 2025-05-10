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
            {name}
        </div>
        <div className={styles.body}>
            {data.body}
        </div>
        <div className={styles.gradeBlock}>
            <div className={styles.grade}>
                {getFiveScale(data, 1)}
            </div>
            <StarsDumb defaultRating={getFiveScale(data)} iconSize="1.7vw"></StarsDumb>
        </div>  
    </div>
);}

export default Review;