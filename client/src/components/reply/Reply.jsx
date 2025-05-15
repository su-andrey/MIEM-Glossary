import styles from "./reply.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
import { useState, useEffect } from "react";

const Reply = ({data}) => {
    const [name, setName] = useState("");
    useEffect(()=>{setName(useNameGenerator())}, []);

    
    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>
                {name}
            </div>
            <div className={styles.body}>
                {data.body}
            </div>
        </div>
);}

export default Reply;