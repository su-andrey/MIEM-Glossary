import { createSelector } from 'reselect';

const selectPosts = state => state.main.posts;
const getCategoryID = (_ , id) => id
const getUnmoderatedCategoryPosts = createSelector(
    [selectPosts, getCategoryID],
    (posts, categoryID) => posts.filter(post => (post.is_moderated === false && post.category.id == categoryID))
);

export default getUnmoderatedCategoryPosts;