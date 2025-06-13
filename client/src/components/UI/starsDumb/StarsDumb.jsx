import styles from "./starsDumb.module.css"
import { useState } from "react";
import star_i from "./assets/star_empty.svg"
import { uid } from "uid";
const DEFAULT_COUNT = 5;
const DEFAULT_ICON = "★";
const DEFAULT_UNSELECTED_COLOR = "#D9D9D9";
const DEFAULT_COLOR = "#FFE100";

export default function StarsDumb({ count, defaultRating, icon, color, iconSize }) {
    if(typeof(defaultRating)===String){
        defaultRating = Number(defaultRating)
    }
    const [rating, setRating] = useState(defaultRating);
    const [temporaryRating, setTemporaryRating] = useState(0);

    let stars = Array(count || DEFAULT_COUNT).fill(icon || DEFAULT_ICON);


    return(
        <div className={styles.starsContainer}>
        {stars.map((item, index) => {
            const isActiveColor = (rating || temporaryRating) && (index < rating || index < temporaryRating);

            let elementColor = "";

            if (isActiveColor) {
            elementColor = color || DEFAULT_COLOR;
            } 
            else {
            elementColor = DEFAULT_UNSELECTED_COLOR;
            }

            return (
            <div
                className={styles.star}
                key={uid()}
                style={{
                fontSize: iconSize ? `${iconSize}` : "2vw",
                color: elementColor,
                filter: `${isActiveColor ? "grayscale(0%)" : "grayscale(100%)"}`,
                }}
            >
                {icon ? icon : DEFAULT_ICON}
            </div>
            );
        })}
        </div>
    );
}