import style from "./loginForm.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
const LoginForm = ({isOpen = true}) => {
    const [open, setOpen] = useState(isOpen);
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
                                value: 40,
                                message: "Слишком длинная почта"
                            },
                            pattern: {
                                value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "Неверный формат почты"
                            },
                            
                        })}
                        />
                        {errors.email && <div className={style.error_warning}>{errors.email.message}</div>}
                        <input 
                        className={errors.password ? style.input_err : style.input} 
                        type="password" 
                        placeholder="Введите пароль..."
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
                        {errors.password && <div className={style.error_warning}>{errors.password.message}</div>}
                        <ActionButton disabled={errors} text={isSubmitting ? "Загрузка..." : "Отправить"} type="submit"></ActionButton>
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