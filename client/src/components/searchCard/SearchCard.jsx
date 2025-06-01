import { uid } from "uid";
import ReactionBlock from "../reactionBlock/ReactionBlock";
import EditField from "../UI/editField/EditField";
import styles from "./searchCard.module.css"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
const SearchCard = ({data, disabled}) => {
    const categories = useSelector(state => state.main.categories)
    const getPostPath = (post) => {
        if(post.category.name == "Преподаватели"){
            return post.is_moderated ? (`/prepods/${post?.id}`) : (`/prepods`)
        }
        else if(post.category.name == "Кофе"){
            return post.is_moderated ? (`/food/1/${post?.id}`) : (`/food/1`)
        }
        else if(post.category.name == "Фастфуд и шаурма"){
            return post.is_moderated ? (`/food/2/${post?.id}`) : (`/food/2`)
        }
        else if(post.category.name == "Копирки"){
            return post.is_moderated ? (`/food/3/${post?.id}`) : (`/food/3`)
        }
        else if(post.category.name == "Магазины"){
            return post.is_moderated ? (`/food/4/${post?.id}`) : (`/food/4`)
        }
        else if(post.category.name == "Вопросы"){
            return post.is_moderated ? (`/questions/${post?.id}`) : (`/questions`)
        }
        else if(post.category.name == "Отзывы"){
            return "/"
        }
    }
    return (
        disabled ?
        <div className={styles.wrapper} style={disabled ? {} : {cursor:"pointer"}}>
            {(data?.category?.name != "Вопросы" && data?.category?.name != "Отзывы") &&
                <div className={styles.title}>{data.name}</div>
            }
            <div className={styles.subtitle}>{data.body}</div>
            {Array.isArray(data?.photos) && data.photos.length > 0 && 
                <img src={data.photos[0].url} alt="photo" className={styles.photo} key={uid()}/>
            }
        </div>
        :
        <Link to={getPostPath(data)}>
            <div className={styles.wrapper} style={disabled ? {} : {cursor:"pointer"}}>
                {(data?.category?.name != "Вопросы" && data?.category?.name != "Отзывы") &&
                    <div className={styles.title}>{data.name}</div>
                }
                <div className={styles.subtitle}>{data.body}</div>
                {Array.isArray(data?.photos) && data.photos.length > 0 &&
                    <img src={data.photos[0].url} alt="photo" className={styles.photo} key={uid()}/>
                }
            </div>
        </Link>
    );
}

export default SearchCard;