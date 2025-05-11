const getUserById = (state, userId) => {
    return state.users.find(user => user.author_id === userId);
};

export default getUserById