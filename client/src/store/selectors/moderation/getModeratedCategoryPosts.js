import { createSelector } from 'reselect';

const selectPosts = state => state.main.posts;
const getCategoryID = (_ , id) => id
const getModeratedCategoryPosts = createSelector(
    [selectPosts, getCategoryID],
    (posts, categoryID) => {
        if(!posts || posts.length == 0){
            return null;
        }
        return posts.filter(post => (post.is_moderated === true && post.category.id == categoryID))
    }
);

export default getModeratedCategoryPosts;