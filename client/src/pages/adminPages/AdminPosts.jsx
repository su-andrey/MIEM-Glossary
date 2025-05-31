import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChanged } from "../../store/mainSlice";
import getUnmoderatedPosts from "../../store/selectors/moderation/getUnmoderatedPosts";
import AdminPostCard from "../../components/adminPostCard/AdminPostCard";
import styles from "./adminList.module.css"
import refreshStorage from "../../store/refreshers/refreshStorage";
import { uid } from "uid";
import getUnmoderatedCategoryPosts from "../../store/selectors/moderation/getUnmoderatedCategoryPosts";
import ActionButton from "../../components/UI/actionButton/ActionButton";
const AdminPosts = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        refreshStorage(dispatch)
    }, [])

    const posts = useSelector(state => getUnmoderatedPosts(state))
    const categories = useSelector(state => state.main.categories)

    const getCategoryID = (categoryName) => {
        return categories.find(category => category.name == categoryName).id
    }

    
    const coffe = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Кофе"))) 
    const shawarma = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Фастфуд и шаурма"))) 
    const copy = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Копирки"))) 
    const shops = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Магазины"))) 
    const prepods = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Преподаватели"))) 
    const questions = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Вопросы"))) 
    const reviews = useSelector(state => getUnmoderatedCategoryPosts(state, getCategoryID("Отзывы")))
    
    const [currentCategory, setCurrentCategory] = useState(coffe)
    return( 
    <>
        <div className={styles.buttonContainer}>
            <ActionButton text="Кофе" onClick={()=>{setCurrentCategory(coffe)}} />
            <ActionButton text="Шаурма" onClick={()=>{setCurrentCategory(shawarma)}} />
            <ActionButton text="Копирки" onClick={()=>{setCurrentCategory(copy)}} />
            <ActionButton text="Магазы" onClick={()=>{setCurrentCategory(shops)}} />
            <ActionButton text="Преподы" onClick={()=>{setCurrentCategory(prepods)}} />
            <ActionButton text="Вопросы" onClick={()=>{setCurrentCategory(questions)}} />
            <ActionButton text="Отзывы" onClick={()=>{setCurrentCategory(reviews)}} />
        </div>
        <div className={styles.container}>
            <div className={styles.title}>
                {
                    currentCategory[0]?.category.name
                }
            </div>
            {Array.isArray(currentCategory) && currentCategory.map((post) => (
                <AdminPostCard data={post} key={post.id}/>
            ))}
        </div>
    </>);
}

export default AdminPosts;