import { createSelector } from 'reselect';

const selectPosts = state => state.main.posts;
const selectPrepodId = (_, id) => id;

const getPrepodByID = createSelector(
    [selectPosts, selectPrepodId],
    (posts, prepodID) => {
        return posts.find(post => (post.id == prepodID && post.category?.name=="Преподаватели"))
    }
);

export default getPrepodByID;