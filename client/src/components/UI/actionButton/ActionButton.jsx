import styles from "./actionButton.module.css";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const ActionButton = forwardRef(({ onClick = () => {}, text = "Click Me", reload = false}, ref) => {
    const handleClick = (e) => {
        onClick(e)
        if(reload){
            window.location.reload();
        }
    }
    return (
        <button
            ref={ref}
            onClick={(e)=>handleClick(e)}
            className={styles.actionButton}
        >
            {text}
        </button>
    );
});

export const MActionButton = motion.create(ActionButton);
export default ActionButton;