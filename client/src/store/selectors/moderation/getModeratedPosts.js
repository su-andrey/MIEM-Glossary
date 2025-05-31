import { createSelector } from 'reselect';

const selectPosts = state => state.main.posts;

const getModeratedPosts = createSelector(
    [selectPosts],
    (posts) => posts.filter(post => post.is_moderated === true)
);

export default getModeratedPosts;