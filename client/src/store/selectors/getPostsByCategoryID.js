import { createSelector } from 'reselect';

const getAllPosts = state => state.main.posts;

const getPostsByCategory = createSelector(
    [getAllPosts, (_, category_id) => category_id],
    (posts, category_id) => {
        return posts.filter(post => post.category_id == category_id);
    }
);

export default getPostsByCategory;
