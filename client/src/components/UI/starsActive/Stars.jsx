import styles from "./stars.module.css"
import { useState } from "react";
import star_i from "./assets/star_empty.svg"
import { uid } from "uid";
const DEFAULT_COUNT = 5;
const DEFAULT_ICON = "★";
const DEFAULT_UNSELECTED_COLOR = "#D9D9D9";
const DEFAULT_COLOR = "#FFE100";

export default function Stars({ count, defaultRating, icon, color, iconSize, sender }) {
    const [rating, setRating] = useState(defaultRating);
    const [temporaryRating, setTemporaryRating] = useState(0);

    let stars = Array(count || DEFAULT_COUNT).fill(icon || DEFAULT_ICON);

    const handleClick = (rating) => {
        setRating(rating);
        //console.log("Rating is set on", rating)
        if(rating>3){
            sender(true)
        }
        else if(rating==3){
            sender(null)
        }
        else if(rating<3){
            sender(false)
        }
    };

    return (
        <div className={styles.starsContainer}>
        {stars.map((item, index) => {
            const isActiveColor =
            (rating || temporaryRating) &&
            (index < rating || index < temporaryRating);

            let elementColor = "";

            if (isActiveColor) {
            elementColor = color || DEFAULT_COLOR;
            } else {
            elementColor = DEFAULT_UNSELECTED_COLOR;
            }

            return (
            <div
                className={styles.star}
                key={uid()}
                style={{
                fontSize: iconSize ? `${iconSize}vw` : "2vw",
                color: elementColor,
                filter: `${isActiveColor ? "grayscale(0%)" : "grayscale(100%)"}`,
                }}
                onMouseEnter={() => setTemporaryRating(index + 1)}
                onMouseLeave={() => setTemporaryRating(0)}
                onClick={() => handleClick(index + 1)}
            >
                {icon ? icon : DEFAULT_ICON}
            </div>
            );
        })}
        </div>
    );
}