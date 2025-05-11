import Header from "../../components/header/Header";
import styles from "./layout.module.css"
import { Link, Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
const Layout = () => {
    return (<>
        <Header></Header>

        <Outlet></Outlet>

        <Footer></Footer>
    </>);
}

export default Layout;