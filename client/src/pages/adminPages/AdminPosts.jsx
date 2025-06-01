import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChanged } from "../../store/mainSlice";
import getUnmoderatedPosts from "../../store/selectors/moderation/getUnmoderatedPosts";
import AdminPostCard from "../../components/adminPostCard/AdminPostCard";
import styles from "./adminList.module.css"
import refreshStorage from "../../store/refreshers/refreshStorage";
import getUnmoderatedCategoryPosts from "../../store/selectors/moderation/getUnmoderatedCategoryPosts";
import ActionButton from "../../components/UI/actionButton/ActionButton";

const AdminPosts = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        refreshStorage(dispatch)
    }, [])

    const categories = useSelector(state => state.main.categories)

    const getCategoryID = (categoryName) => {
        return categories.find(category => category.name === categoryName)?.id
    }

    const coffe = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Кофе"))) 
    const shawarma = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Фастфуд и шаурма"))) 
    const copy = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Копирки"))) 
    const shops = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Магазины"))) 
    const prepods = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Преподаватели"))) 
    const questions = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Вопросы"))) 
    const reviews = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Отзывы")))

    const [selectedCategoryName, setSelectedCategoryName] = useState("Кофе")

    const categoryMap = {
        "Кофе": coffe,
        "Шаурма": shawarma,
        "Копирки": copy,
        "Магазы": shops,
        "Преподы": prepods,
        "Вопросы": questions,
        "Отзывы": reviews
    }

    const currentCategory = categoryMap[selectedCategoryName] ?? []

    return( 
    <>
        <div className={styles.buttonContainer}>
            <ActionButton text="Кофе" onClick={()=>{setSelectedCategoryName("Кофе")}} />
            <ActionButton text="Шаурма" onClick={()=>{setSelectedCategoryName("Шаурма")}} />
            <ActionButton text="Копирки" onClick={()=>{setSelectedCategoryName("Копирки")}} />
            <ActionButton text="Магазы" onClick={()=>{setSelectedCategoryName("Магазы")}} />
            <ActionButton text="Преподы" onClick={()=>{setSelectedCategoryName("Преподы")}} />
            <ActionButton text="Вопросы" onClick={()=>{setSelectedCategoryName("Вопросы")}} />
            <ActionButton text="Отзывы" onClick={()=>{setSelectedCategoryName("Отзывы")}} />
        </div>
        <div className={styles.container}>
            <div className={styles.title}>
                {
                    currentCategory[0]?.category?.name
                }
            </div>
            {Array.isArray(currentCategory) && currentCategory.map((post) => (
                <AdminPostCard data={post} key={post.id}/>
            ))}
        </div>
    </>);
}

export default AdminPosts;