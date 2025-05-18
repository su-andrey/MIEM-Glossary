import styles from "./actionButton.module.css";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const ActionButton = forwardRef(({ onClick = () => {}, text = "Click Me", ...rest }, ref) => {
    return (
        <button
            ref={ref}
            onClick={onClick}
            className={styles.actionButton}
            {...rest}
        >
            {text}
        </button>
    );
});

export const MActionButton = motion(ActionButton);