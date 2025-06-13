import { createSelector } from 'reselect';

const selectPosts = state => state.main.posts
const selectCategoryID = (_, categoryID) => categoryID
const getPostsByCategory = createSelector(
    [selectPosts, selectCategoryID],
    (posts, categoryID)=>{
        return posts?.filter(post => post.category?.id == categoryID);
    }
)
export default getPostsByCategory;
