import styles from "./actionButton.module.css";

const ActionButton = ({ onClick = () => {}, text="click Me" }) => {
    return (
        <button
            onClick={onClick}
            className={styles.actionButton}
        >
            {text}
        </button>
    );
};

export default ActionButton;