import styles from "./adminPage.module.css"
import Loader1 from "../../components/UI/loader1/Loader1";
import { Outlet } from "react-router-dom";
import ActionButton from "../../components/UI/actionButton/ActionButton";
import { Link } from "react-router-dom";
const AdminPage = () => {
    return ( 
        <>
            <div className={styles.navbar}>
                <Link to="/admin/posts"><ActionButton text="Posts"/></Link>
                <Link to="/admin/comments"><ActionButton text="Comments"/></Link>
            </div>
            <Outlet />
        </>
    );
}

export default AdminPage;