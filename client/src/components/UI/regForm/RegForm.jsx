import style from "./regForm.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
const RegisterForm = ({initialOpen = true}) => {
    const [open, setOpen] = useState(initialOpen);
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

    return (
        <>
            {open && <div className={style.background}>
                <div className={style.wrapper}>
                    <MdOutlineCancel className={style.cancel} onClick={()=>{handleClose()}} />
                    <div className={style.title}>Регистрация</div>
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
                        placeholder="Создайте пароль..."
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
                        <input 
                        className={errors.confirm ? style.input_err : style.input} 
                        type="password" 
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
                        {errors.confirm && <div className={style.error_warning}>{errors.confirm.message}</div>}
                        <div className={style.checkboxContainer}>
                            <input 
                            className={style.check} 
                            type="checkbox" 
                            id="myCheckbox"
                            {...register('joke', {
                                required: "Поле обязательно к подтверждению",
                            })}
                            />
                            <label className={style.checkboxCaption} htmlFor="myCheckbox">Обязуюсь отказаться от необоснованных оскорблений, оставив только обоснованные.</label>
                        </div>
                        {errors.joke && <div className={style.error_warning}>{errors.joke.message}</div>}
                        <ActionButton disabled={errors} text={isSubmitting ? "Загрузка..." : "Отправить"} type="submit"></ActionButton>
                            <div className={style.regCaption} onClick={()=> handleRedirect()}>
                                Уже есть аккаунт?<br />
                                <span className={style.regMainCaption}>Вход</span>
                            </div>
                    </form>
                </div>
            </div>}
        </>
    );
}
export default RegisterForm;