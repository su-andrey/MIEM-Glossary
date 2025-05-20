import styles from "./../../cabinetPage.module.css"
import { useSelector, useDispatch } from "react-redux";
import ActionButton from "./../../../../components/UI/actionButton/ActionButton.jsx";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import EyeIcon from "../eyeIcon/EyeIcon.jsx";
import { useState } from "react";

const ChangeForm = () => {
    const dispatch = useDispatch();
    let isAuth = useSelector(state => state.main.isAuthentificated);
    let isAdmin = useSelector(state => state.main.isAdmin);
    const userEmail = useSelector(state => state.main.email);
    const userPassword = useSelector(state => state.main.password);

    const [input1Type, changeInput1Type] = useState(false);
    const [input2Type, changeInput2Type] = useState(false);

    const {
        register,
        formState: {
            errors,
            isSubmitting,
        },
        reset,
        handleSubmit,
        watch,
        control,
    } = useForm({
        mode: "all",
        defaultValues: {
            email: userEmail,
            password: userPassword,
            confirm: userPassword
        }
    })

    const onSubmit = async (data) => {
        try {
            console.log(data);
            setOpen(false);
        } catch(error) {
            console.error(error);
        }
        reset();
    }

    const location = useLocation();
    const navigate = useNavigate();
    let fromPage = location.state?.from?.pathname || "/";
    if(fromPage=="/login") {
        fromPage = "/"
    }
    
    const handleClose = () => {
        setOpen(false);
        navigate(fromPage);
    }

    const handleRedirect = () => {
        navigate("/login", { state: { from: location } });
    }

    const password = watch('password');
    
    return ( 
        <form className={styles.changeForm} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.subtitle}>
                Ваши данные:
            </div>
            <input 
                className={errors.email ? styles.input_err : styles.input} 
                type="email" 
                placeholder="Ваша почта..."
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
            
            <div className={styles.inputContainer}>
                <input
                    className={errors.password ? styles.input_err : styles.input}
                    type={input1Type ? "text" : "password"}
                    placeholder="Ваш новый пароль..."
                    style={{width:"100%"}}
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
                            value: /^[a-zA-Z0-9!@#$%\^\&*_=+-]{8,12}$/g,
                            message: "Неверный формат пароля"
                        },
                    })}
                />
                <EyeIcon handleVisible={changeInput1Type} />
            </div>
            {errors.password && <div className={styles.error_warning}>{errors.password.message}</div>}
            
            <div className={styles.inputContainer}>
                <input 
                    style={{width:"100%"}}
                    className={errors.confirm ? styles.input_err : styles.input} 
                    type={input2Type ? "text" : "password"}
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
                <EyeIcon handleVisible={changeInput2Type}/>
            </div>
            {errors.confirm && <div className={styles.error_warning}>{errors.confirm.message}</div>}
            
            <ActionButton 
                disabled={Object.keys(errors).length > 0 || isSubmitting} 
                text={isSubmitting ? "Загрузка..." : "Изменить"} 
                type="submit"
            />
        </form>
    );
}

export default ChangeForm;