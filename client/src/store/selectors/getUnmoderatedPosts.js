import { createSelector } from 'reselect';

const selectPosts = state => state.main.posts;

const getUnmoderatedPosts = createSelector(
    [selectPosts],
    (posts) => posts.filter(post => post.is_moderated == false)
);

export default getUnmoderatedPosts;