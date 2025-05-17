import { createSelector } from 'reselect';
const getAllPosts = state => state.main.posts;

const getPostsByID = createSelector(
    [getAllPosts, (_, id) => id],
    (posts, id) => {
        return posts.find(post => post.id == id);
    }
);


export default getPostsByID;