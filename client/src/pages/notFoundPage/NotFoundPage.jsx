import ErrorBoxSpawner from "./errorBoxSpawner/ErrorBoxSpawner";
import styles from "./notFoundPage.module.css"
import { Link } from "react-router-dom";
const NotFoundPage = () => {
    return(
    <>
        <Link to="/">
            <div className={styles.wrapper}>
            
            </div>
        </Link>
        <ErrorBoxSpawner></ErrorBoxSpawner>
    </>
);}

export default NotFoundPage;