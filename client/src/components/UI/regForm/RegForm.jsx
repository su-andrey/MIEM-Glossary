import style from "./regForm.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useEffect } from "react";
import HandleRegisterUser from "./../../../store/middleware functions/HandleRegisterUser";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import EyeIcon from "../../../pages/cabinetPage/subcomponents/eyeIcon/EyeIcon";
const RegisterForm = ({initialOpen = true}) => {
    const [regError, setRegError] = useState("");
    const [input1Type, changeInput1Type] = useState(false);
    const [input2Type, changeInput2Type] = useState(false);
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
        console.log("Отправили вот это", data)
        try{
            await HandleRegisterUser(data.email, data.password)
            setOpen(false);
            reset();
            handleRedirect();
        }
        catch(error){
            console.log("Popalsa")
            if (error.response?.status == 401) {
                setRegError("Такой пользователь уже существует");
            } else {
                setRegError("Ошибка регистрации. Попробуйте позже.");
            }
            console.error(error);
        }
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
                            style={{width:"100%"}}
                            className={errors.password ? style.input_err : style.input} 
                            placeholder="Создайте пароль..."
                            type={input1Type ? "text" : "password"}
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
                                    value: /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g,
                                    message: "Неверный формат пароля"
                                },
                            })}
                            />
                            <EyeIcon handleVisible={changeInput1Type}/>
                        </div>
                        {errors.password && <div className={style.error_warning}>{errors.password.message}</div>}
                        <div className={style.inputContainer}>
                            <input 
                            style={{width:"100%"}}
                            className={errors.confirm ? style.input_err : style.input} 
                            type={input2Type ? "text" : "password"}
                            placeholder="Подтвердите ваш пароль..." 
                            {...register('confirm', {
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
                                    value: /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g,
                                    message: "Неверный формат пароля"
                                },
                                validate: (value) =>
                                    value === password || "Пароли не совпадают"
                            })}
                            />
                            <EyeIcon handleVisible={changeInput2Type} />
                        </div>
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
                        {regError && <div className={style.error_warning}>{regError}</div>}
                        <ActionButton disabled={Object.keys(errors).length > 0 || isSubmitting} text={isSubmitting ? "Загрузка..." : "Отправить"} type="submit"></ActionButton>
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