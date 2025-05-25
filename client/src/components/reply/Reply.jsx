import styles from "./reply.module.css"
import useNameGenerator from "../../custom hooks/useNameGenerator";
import { useState, useEffect } from "react";

const Reply = ({data, serv}) => {
    const [name, setName] = useState("");
    useEffect(()=>{setName(useNameGenerator())}, []);

    
    return (
        <div className={styles.wrapper}>
            <div className={styles.name}>
                {data.nothing || name}
            </div>
            <div className={styles.body}>
                {data.body}
            </div>
        </div>
);}

export default Reply;