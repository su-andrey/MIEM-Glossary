import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChanged } from "../../store/mainSlice";
import getUnmoderatedPosts from "../../store/selectors/getUnmoderatedPosts";
import AdminPostCard from "../../components/adminPostCard/AdminPostCard";
import styles from "./adminList.module.css"
import refreshStorage from "../../store/refreshers/refreshStorage";
import { uid } from "uid";
const AdminPosts = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        refreshStorage(dispatch)
    }, [])

    const posts = useSelector(state => getUnmoderatedPosts(state))
    return( 
    <>
        <div className={styles.container}>
            {Array.isArray(posts) && posts.map((post) => (
                <AdminPostCard data={post} key={uid()}/>
            ))}
        </div>
    </>);
}

export default AdminPosts;