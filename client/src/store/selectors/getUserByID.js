import { createSelector } from 'reselect';

const selectUsers = state => state.main.users;
const selectUserId = (_, id) => id;

const getUserByID = createSelector(
    [selectUsers, selectUserId],
    (users, id) => users.find(user => user.id == id)
);

export default getUserByID;