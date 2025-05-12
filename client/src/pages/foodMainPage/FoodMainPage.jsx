import styles from "./foodPage.module.css"
import CafeCard from "../../components/cafeCard/CafeCard.jsx";
import { uid } from "uid";
import image from "./../../assets/jpg/cafe_categories/soup.jpg"
import { Link } from "react-router-dom";
const FoodMainPage = () => {
    const data = [
        {
            name: "Кофе и еда",
            image: image,
            category_id: 1,
        },
        {
            name: "Фастфуд и шаурма",
            image: image,
            category_id: 2,
        },
        {
            name: "Копирки",
            image: image,
            category_id: 3,
        },
        {
            name: "Магазины",
            image: image,
            category_id: 4,
        },
    ]
    console.log("DATA:", data);
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
                        console.log("CATEGORY:", category);
                        return(
                            <Link to={`/food/${category.category_id}`}><CafeCard key={uid()} data={category} ></CafeCard></Link>
                        )
                    })
                }
            </div>
        </div>
    </>);
}

export default FoodMainPage;