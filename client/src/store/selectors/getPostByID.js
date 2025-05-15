import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
const getAllPosts = state => state.main.posts;

const getPostsByID = createSelector(
    [getAllPosts, (_, id) => id],
    (posts, id) => {
        return posts.find(post => post.id == id);
    }
);


export default getPostsByID;