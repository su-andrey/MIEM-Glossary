import style from "./loginForm.module.css"
import ActionButton from "../actionButton/ActionButton";
import { MdOutlineCancel } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useState } from "react";
const LoginForm = () => {
    const [open, setOpen] = useState(false);
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

    const password = watch('password');

    return (
        <>
            <ActionButton text="Вход" onClick={()=>{setOpen(true)}}></ActionButton>
            {open && <div className={style.background}>
                <div className={style.wrapper}>
                    <MdOutlineCancel className={style.cancel} onClick={()=>{setOpen(false)}} />
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
                    </form>
                </div>
            </div>}
        </>
    );
}
export default LoginForm;