import React from 'react';
import styles from './ErrorBox.module.css';

const ErrorBox = ({ isExiting, onAnimationEnd }) => {
    return (
        <div
        className={`${styles.errorBox} ${isExiting ? styles.out : ''}`}
        onAnimationEnd={onAnimationEnd}
        >
        <header>
            <h1>../404.html</h1>
            <a href="#" className={styles.close}>&times;</a>
        </header>
        <div className={styles.content}>
            <i className={styles.iconError} aria-hidden="true">
            error
            <svg viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="20" />
                <line x1="10" y1="10" x2="30" y2="30" />
                <line x1="30" y1="10" x2="10" y2="30" />
            </svg>
            </i>
            <p>The page was not found</p>
        </div>
        <footer>
            <button>I`ll cry about it</button>
        </footer>
        </div>
    );
};

export default ErrorBox;