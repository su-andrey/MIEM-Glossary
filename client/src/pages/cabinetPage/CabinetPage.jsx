import styles from "./cabinetPage.module.css"
import { useSelector, useDispatch } from "react-redux";
import button from "./../../assets/vectors/brand/hseButton.svg"
import ActionButton from "./../../components/UI/actionButton/ActionButton.jsx";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
const CabinetPage = () => {
    const dispatch = useDispatch;
    let isAuth = useSelector(state => state.main.isAuthentificated);
    let isAdmin = useSelector(state => state.main.isAdmin);
    const [email, setEmail] = useState(useSelector(state => state.main.email))
    const [initialPassword, setPassword] = useState(useSelector(state => state.main.password))
    const {
        register,
        formState: {
            errors,
            isSubmitting,
        },
        reset,
        handleSubmit,
        watch,
    } = useForm({mode: "all",})

    const onSubmit = async (data)=> {
        try{
            console.log(data)
            setOpen(false);
        }
        catch(error){
            console.error(error)
        }
        reset()
    }

    const location = useLocation();
    const navigate = useNavigate();
    let fromPage = location.state?.from?.pathname || "/";
    if(fromPage=="/login"){
        fromPage = "/"
    }
    const handleClose = () => {
        setOpen(false)
        navigate(fromPage)
    }

    const handleRedirect = ()=>{
        navigate("/login", { state: { from: location } });
    }

    const password = watch('password');

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
                <form className={styles.changeForm} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.subtitle}>
                        Ваши данные:
                    </div>
                    <input 
                    className={errors.email ? styles.input_err : styles.input} 
                    type="email" 
                    placeholder="Ваша почта..."
                    value={email}
                    //onChange={(e)=>handleChange(e)}
                    {...register('email', {
                        required: "Поле обязательно к заполнению",
                        minLength: {
                            value: 5,
                            message: "Слишком короткая почта"
                        },
                        maxLength: {
                            value: 40,
                            message: "Слишком длинная почта"
                        },
                        pattern: {
                            value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            message: "Неверный формат почты"
                        },
                        
                    })}
                    />
                    {errors.email && <div className={styles.error_warning}>{errors.email.message}</div>}
                    <input 
                    className={errors.password ? styles.input_err : styles.input} 
                    type="password" 
                    value = {initialPassword}
                    placeholder="Ваш новый пароль..."
                    {...register('password', {
                        required: "Поле обязательно к заполнению",
                        minLength: {
                            value: 8,
                            message: "Слишком короткий пароль"
                        },
                        maxLength: {
                            value: 40,
                            message: "Слишком длинный пароль"
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g,
                            message: "Неверный формат пароля"
                        },
                    })}
                    />
                    {errors.password && <div className={styles.error_warning}>{errors.password.message}</div>}
                    <input 
                    className={errors.confirm ? styles.input_err : styles.input} 
                    type="password" 
                    value = {initialPassword}
                    placeholder="Подтвердите ваш пароль..." 
                    {...register('confirm', {
                        required: "Поле обязательно к заполнению",
                        minLength: {
                            value: 8,
                            message: "Слишком короткий пароль"
                        },
                        maxLength: {
                            value: 40,
                            message: "Слишком длинный пароль"
                        },
                        pattern: {
                            value: /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g,
                            message: "Неверный формат пароля"
                        },
                        validate: (value) =>
                            value === password || "Пароли не совпадают"
                    })}
                    />
                    {errors.confirm && <div className={styles.error_warning}>{errors.confirm.message}</div>}
                    <ActionButton disabled={errors} text={isSubmitting ? "Загрузка..." : "Изменить"} type="submit"></ActionButton>
                </form>
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