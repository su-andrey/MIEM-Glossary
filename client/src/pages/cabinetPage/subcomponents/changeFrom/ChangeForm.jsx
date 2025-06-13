import styles from "./../../cabinetPage.module.css"
import { useSelector, useDispatch } from "react-redux";
import ActionButton from "./../../../../components/UI/actionButton/ActionButton.jsx";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import EyeIcon from "../eyeIcon/EyeIcon.jsx";
import { useState } from "react";
import { setEmail, setUserID } from "../../../../store/mainSlice.js";
import editMyData from "../../../../queries/USER/editMyData.js";
import getMe from "./../../../../queries/USER/getMe.js";
import logOutUser from "../../../../queries/USER/logOutUser.js";

const ChangeForm = () => {
    const dispatch = useDispatch();

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
    })

    const onSubmit = async (data) => {
        try {
            //console.log(data);
            let me  = await getMe()
            //console.log(me)
            await editMyData(data.email, data.password, me.id, me.is_admin)
            dispatch(setEmail(me.email))
            reset();
        } 
        catch(error) {
            console.error(error);
        }
    }

    const location = useLocation();
    const navigate = useNavigate();
    let fromPage = location.state?.from?.pathname || "/";
    if(fromPage=="/login") {
        fromPage = "/"
    }
    

    const handleRedirect = () => {
        navigate("/login", { state: { from: location } });
    }

    const password = watch('password');
    
    const handleExit = ()=>{
        logOutUser();
        dispatch(setEmail(""))
        dispatch(setUserID(null))
        navigate("/");
    }

    return ( 
        <form className={styles.changeForm} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.subtitle}>
                Смена пароля:
            </div>
            <div className={styles.inputContainer}>
                <input 
                    style={{width:"100%"}}
                    className={errors.email ? styles.input_err : styles.input} 
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
            </div>

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
                            value: /^[a-zA-Z0-9!@#$%\^\&*_=+-]{8,40}$/g,
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
                            value: /^[a-zA-Z0-9!@#$%\^\&*_=+-]{8,40}$/g,
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

            <ActionButton 
                onClick={handleExit}
                text={"Выйти"} 
            />
        </form>

    );
}

export default ChangeForm;