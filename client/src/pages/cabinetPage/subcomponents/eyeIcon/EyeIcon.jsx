import styles from "./eyeIcon.module.css"
import { useState } from "react";
import open from "./assets/svg/open.svg"
import closed from "./assets/svg/closed.svg"
const EyeIcon = ({handleVisible}) => {
    const [visible, setVisible] = useState(false);
    return ( 
    <div className={styles.wrapper}>
        <img 
            src={visible ? open : closed} 
            alt="eye" 
            className={styles.eye}
            onClick={()=>{
                        setVisible(!visible)
                        handleVisible(!visible)
                    }
                }
        />
    </div>
);}

export default EyeIcon;