import { createSelector } from 'reselect';

const getAllPosts = state => state.main.posts;

const getPostsByID = createSelector(
    [getAllPosts, (_, post_id) => post_id],
    (posts, post_id) => {
        return posts.find(post => post.post_id == post_id);
    }
);

export default getPostsByID;