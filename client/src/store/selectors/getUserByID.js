import { createSelector } from 'reselect';

const getAllUsers = state => state.main.users;

const getUserByID = createSelector(
    [getAllUsers, (_, id) => id],
    (users, id) => {
        return users.find(user => user.id == id);
    }
);

export default getUserByID;