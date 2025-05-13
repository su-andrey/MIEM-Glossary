import styles from "./foodPage.module.css"
import CafeCard from "../../components/cafeCard/CafeCard.jsx";
import { uid } from "uid";
import image from "./../../assets/jpg/cafe_categories/soup.jpg"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import getCategories from "../../store/selectors/getCategories.js";
const FoodMainPage = () => {
    const data = useSelector(state => getCategories(state));
    return (
    <>
        <div className={styles.wrapper}>
            <div className={styles.title}>
                Куда сходить?
            </div>
            <div className={styles.caption}>
                Выберите интересующую услугу или заведение
            </div>
            <div className={styles.container}>
                {
                    data.map((category) => {
                        if(category.name == "Кофе и еда" || category.name == "Фастфуд и шаурма" || category.name == "Копирки" || category.name == "Магазины"){
                            return(
                            <Link to={`/food/${category.category_id}`}><CafeCard key={uid()} data={category} ></CafeCard></Link>
                        )}
                    })
                }
            </div>
        </div>
    </>);
}

export default FoodMainPage;