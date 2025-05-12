import styles from "./cabinetPage.module.css"
import { Link } from "react-router-dom";
const CabinetPage = () => {
    return (<>
    <Link to="/login">
        <button>вход</button>
    </Link>
    <Link to="/register">
        <button>регистрация</button>
    </Link>
    </>);
}

export default CabinetPage;