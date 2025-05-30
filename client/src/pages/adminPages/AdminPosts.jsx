import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChanged } from "../../store/mainSlice";
import getUnmoderatedPosts from "../../store/selectors/getUnmoderatedPosts";

const AdminPosts = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(setChanged(true))
    }, [])

    const posts = useSelector(state => getUnmoderatedPosts(state))
    return( 
    <>
        <div>
            {Array.isArray(posts) && posts.map((post) => (
                <div key={post.id}>
                    <hr />
                    <div>{post.id}</div>
                    <div>{post.name}</div>
                    <div>{post.body}</div>
                    <hr />
                </div>
            ))}
        </div>
    </>);
}

export default AdminPosts;