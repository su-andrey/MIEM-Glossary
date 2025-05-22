import styles from "./cabinetPage.module.css"
import { useSelector, useDispatch } from "react-redux";
import button from "./../../assets/vectors/brand/hseButton.svg"
import ActionButton from "./../../components/UI/actionButton/ActionButton.jsx";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Loader from "../../components/UI/loader/Loader.jsx";
import ChangeForm from "./subcomponents/changeFrom/ChangeForm.jsx";
import EyeIcon from "./subcomponents/eyeIcon/EyeIcon.jsx";
import Loader1 from "../../components/UI/loader1/Loader1.jsx";
import editMyData from "../../queries/USER/editMyData.js";
const CabinetPage = () => {
    const dispatch = useDispatch;
    let isAuth = useSelector(state => state.main.isAuthentificated);
    let isAdmin = useSelector(state => state.main.isAdmin);
    const [email, setEmail] = useState(useSelector(state => state.main.email))
    const [initialPassword, setPassword] = useState(useSelector(state => state.main.password))
    const [initialConfirm, setConfirm] = useState(useSelector(state => state.main.password))

    let name = useSelector(store => store.main.email) || localStorage.getItem("email") || "Профиль"
    name = name.split('@')[0];
    if(name.length > 12){
        name = name.slice(0, 13)
    }


    const location = useLocation();
    const navigate = useNavigate();
    let fromPage = location.state?.from?.pathname || "/";
    if(fromPage=="/login"){
        fromPage = "/"
    }


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

    useEffect(()=>{
        if(!email || !initialPassword || !initialConfirm){
            setEmail(localStorage.getItem("email"))
            setPassword(localStorage.getItem("password"))
            setConfirm(localStorage.getItem("confirm"))
        }
    }, [])
    
    if (!ready) return <Loader/>;
    
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
                    <div className={styles.subtitle} style={{marginTop:"calc(-1*var(--page-vertical-gap))"}}>Здравствуйте, {name} </div>
                    <ChangeForm />
                </>
            }
            {
                isAdmin && 
                <>
                </>
            }
            <img src={button} alt="HSE button" className={styles.hsebutton}/>
        </div>
        </>
    );
}

export default CabinetPage;