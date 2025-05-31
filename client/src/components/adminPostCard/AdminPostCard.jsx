import EditField from "../UI/editField/EditField";
import styles from "./adminPostCard.module.css"
const AdminPostCard = ({data}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.title}>Category: {data.category.name}</div>
            <div className={styles.title}>Name: {data.name}</div>
            <div className={styles.title}>Body: {data.body}</div>
            <div className={styles.title}>Photos:</div>
                {Array.isArray(data?.photos) && data.photos.length > 0 && data.photos.map((photo, index) => (
                    photo?.url && (
                        <div key={index}>
                            <a href={photo.url}>
                                <div className={styles.link}>{photo.url}</div>
                            </a>
                            <img src={photo.url} alt="photo" className={styles.photo}/>
                        </div>
                    )
                ))}
            <EditField data={data} adminVersion={true} />
        </div>
    );
}

export default AdminPostCard;