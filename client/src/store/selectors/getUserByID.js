import { createSelector } from 'reselect';

const getAllUsers = state => state.main.users;

const getUserByID = createSelector(
    [getAllUsers, (_, author_id) => author_id],
    (users, author_id) => {
        return users.find(user => user.author_id == author_id);
    }
);

export default getUserByID;