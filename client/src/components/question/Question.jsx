import styles from "./question.module.css"
import getFiveScale from "../../custom hooks/useGetFiveScale";
import StarsDumb from "../UI/starsDumb/StarsDumb";
import { useState, useEffect } from "react";
import useNameGenerator from "../../custom hooks/useNameGenerator";
import comment from "./assets/comment/comment.svg"
import like_empty from "./assets/like/like_empty.svg"
import like_filled from "./assets/like/like_filled.svg"
import dislike from "./assets/dislike/dislike.svg"
import React, { useRef } from 'react';
import { loadFireworksPreset } from 'tsparticles-preset-fireworks';
import { useCallback } from 'react';
import { useParticles } from 'react-tsparticles';
const Question = ({data}) => {
    const [name, setName] = useState("");
    useEffect(()=>{setName(useNameGenerator())}, []);
    const [liked, setLiked] = useState(false);

    const particlesRef = useRef(null);

    const particlesInit = useCallback(async engine => {
        await loadFireworksPreset(engine); // загружаем готовый пресет "фейерверк"
    }, []);

    const handleClick = () => {
        setLiked(!liked)
    };
    return (
        <div className={styles.wrapper}>
                <div className={styles.title}>
                    {name}
                </div>
                <div className={styles.body}>
                    {data.body}
                </div>
                <div className={styles.commentBlock}>
                    <div onClick={()=>{handleClick()}} className={styles.comment}>
                        <img src={liked ? like_filled : like_empty} alt="like button" className={styles.like_icon}/>
                        
                        <span className={styles.like_counter}>{data.likes}</span>
                    </div>
                    <div className={styles.comment}>
                        <img src={comment} alt="comment button" className={styles.comment_icon}/>
                        <span className={styles.comment_counter}>{data.comments}</span>
                    </div>
                    <div className={styles.comment}>
                        <img src={dislike} className={styles.dislike_icon} alt="dislike button" />
                        <span className={styles.dislike_counter}>{data.dislikes}</span>
                    </div>
                </div>
        </div>
);}

export default Question;