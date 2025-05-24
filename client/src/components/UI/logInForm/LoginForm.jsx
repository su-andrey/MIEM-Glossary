import style from "./loginForm.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import logInUser from "../../../queries/USER/logInUser";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EyeIcon from "../../../pages/cabinetPage/subcomponents/eyeIcon/EyeIcon";
import { handleLogIn, resetState } from "../../../store/mainSlice";
import getMe from "../../../queries/USER/getMe";
const LoginForm = ({isOpen = true}) => {
    const dispatch = useDispatch();
    const [input1Type, changeInput1Type] = useState(false);
    const [open, setOpen] = useState(isOpen);
    const [loginError, setLoginError] = useState("");
    const isAuthentificated = useSelector(state => state.main.isAuthentificated);
    const isAdmin = useSelector(state => state.main.isAdmin);
    const location = useLocation();
    const navigate = useNavigate();
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

    useEffect(() => {
    if (isAuthentificated !== false && isAdmin !== null) {
        navigate("/");
    }
    }, [isAuthentificated, isAdmin, navigate]);

    const onSubmit = async (data)=> {
        try{
            setLoginError("");
            await logInUser(data.email, data.password)
            setLoginError("");
            let me = await getMe()
            if (!me) {
            throw new Error("Ошибка получения данных пользователя после входа");
            }

            dispatch(handleLogIn({
                email: data.email,
                password: data.password,
                isAdmin: me.is_admin,
                userID: me.id,
            }))
            setOpen(false);
        }
        catch (error) {
            if (error.response?.status === 401) {
                setLoginError("Неверный логин или пароль");
            } 
            else {
                setLoginError("Ошибка входа. Попробуйте позже.");
            }
            console.error(error);
        }
    }

    
    let fromPage = location.state?.from?.pathname || "/";
    if(fromPage=="/register"){
        fromPage = "/"
    }

    const handleClose = () => {
        setOpen(false)
        navigate(fromPage)
    }


    const handleRedirect = ()=>{
        navigate("/register", { state: { from: location } });
    }
    const password = watch('password');

    return (
        <>
            {open && <div className={style.background}>
                <div className={style.wrapper}>
                    <MdOutlineCancel className={style.cancel} onClick={()=>{handleClose()}} />
                    <div className={style.title}>Вход</div>
                    <form className={style.formContainer} onSubmit={handleSubmit(onSubmit)}>
                        
                        <input 
                        className={errors.email ? style.input_err : style.input} 
                        type="email" 
                        placeholder="Введите вашу почту..."
                        {...register('email', {
                            required: "Поле обязательно к заполнению",
                            minLength: {
                                value: 5,
                                message: "Слишком короткая почта"
                            },
                            maxLength: {
                                value: 100,
                                message: "Слишком длинная почта"
                            },
                            pattern: {
                                value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "Неверный формат почты"
                            },
                            
                        })}
                        />
                        {errors.email && <div className={style.error_warning}>{errors.email.message}</div>}
                        <div className={style.inputContainer}>
                            <input 
                            className={errors.password ? style.input_err : style.input} 
                            type={input1Type ? "text" : "password"} 
                            placeholder="Введите пароль..."
                            style={{width:"100%"}}
                            {...register('password', {
                                required: "Поле обязательно к заполнению",
                                minLength: {
                                    value: 8,
                                    message: "Слишком короткий пароль"
                                },
                                maxLength: {
                                    value: 100,
                                    message: "Слишком длинный пароль"
                                },
                                pattern: {
                                    value: /^[a-zA-Z0-9!@#\$%\^&*()_\-+=\[\]{}:;'",.<>/?\\|`~]{1,}$/,
                                    message: "Неверный формат пароля"
                                }
                            })}
                            />
                            <EyeIcon handleVisible={changeInput1Type}/>
                        </div>
                        {errors.password && <div className={style.error_warning}>{errors.password.message}</div>}
                        {loginError && <div className={style.error_warning}>{loginError}</div>}
                        <ActionButton disabled={Object.keys(errors).length > 0 || isSubmitting} text={isSubmitting ? "Загрузка..." : "Отправить"} type="submit"></ActionButton>
                        <div className={style.regCaption} onClick={()=> handleRedirect()}>
                            Еще нет аккаунта?<br />
                            <span className={style.regMainCaption}>Регистрация</span>
                        </div>
                    </form>
                </div>
            </div>}
        </>
    );
}
export default LoginForm;