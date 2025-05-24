import styles from "./cabinetPage.module.css"
import { useSelector, useDispatch } from "react-redux";
import button from "./../../assets/vectors/brand/hseButton.svg"
import ActionButton from "./../../components/UI/actionButton/ActionButton.jsx";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import Loader from "../../components/UI/loader/Loader.jsx";
import ChangeForm from "./subcomponents/changeFrom/ChangeForm.jsx";
import EyeIcon from "./subcomponents/eyeIcon/EyeIcon.jsx";
import Loader1 from "../../components/UI/loader1/Loader1.jsx";
import editMyData from "../../queries/USER/editMyData.js";
import AdminPage from "../adminPage/AdminPage.jsx";
import checkLogIn from "../../queries/USER/checkLogIn.js";
import checkAdmin from "../../queries/USER/checkAdmin.js";
import getMe from "../../queries/USER/getMe.js";

const CabinetPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    let fromPage = location.state?.from?.pathname || "/";
    if(fromPage=="/login"){
        fromPage = "/"
    }

    const [isAuth, setAuth] = useState(false);
    const [isAdmin, setAdmin] = useState(false);
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        const getInfo = async ()=>{
            const result = await getMe();
            setAuth(result.email);
            setAdmin(result.is_admin);
            setLoading(false)
        }
        getInfo();
    }, [])

    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        const handleLoad = () => setReady(true);
    if (document.readyState === 'complete') {
        handleLoad();
    } 
    else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
    }
    }, []);


    
    if (!ready || loading) return <Loader1 />;
    
    return(
        <>
        <div className={styles.wrapper}>
            <div className={styles.title}>
                Личный кабинет
            </div>
            
            {!isAuth && 
                <Navigate to="/login" state={{from: location.pathname}}></Navigate>
            }
            {isAuth && 
                <>
                    <ChangeForm />
                </>
            }
            {
                isAdmin && isAuth &&
                <Link to="/admin"><ActionButton text="Админ"></ActionButton></Link>
            }
            <img src={button} alt="HSE button" className={styles.hsebutton}/>
        </div>
        </>
    );
}

export default CabinetPage;