import Header from "../../components/header/Header";
import styles from "./layout.module.css"
import { Link, Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import useScrollToTop from "../../custom hooks/useScrollToTop";
const Layout = () => {
    useScrollToTop()
    return (<>
        <Header></Header>

        <Outlet></Outlet>

        <Footer></Footer>
    </>);
}

export default Layout;