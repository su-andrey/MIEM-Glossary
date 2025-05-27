import { createSlice } from "@reduxjs/toolkit";
import image from "./../assets/jpg/cafe_categories/soup.jpg";
import coffe from "./../assets/categories/coffe.jpg"
import doner from "./../assets/categories/doner.jpg"
import paper from "./../assets/categories/paper.jpg"
import store from "./../assets/categories/store.jpg"

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        users : [],
        posts : [],
        comments : [],
        categories : [
                        {
                            "id": 1,
                            "name": "Кофе",
                            "image": coffe,
                        },
                        {
                            "id": 2,
                            "name": "Фастфуд и шаурма",
                            "image": doner,
                        },
                        {
                            "id": 3,
                            "name": "Копирки",
                            "image": paper,
                        },
                        {
                            "id": 4,
                            "name": "Магазины",
                            "image": store,
                        },
                        {
                            "id": 5,
                            "name": "Преподаватели"
                        },
                        {
                            "id": 6,
                            "name": "Вопросы"
                        },
                        {
                            "id": 7,
                            "name": "Отзывы"
                        }
                    ],
        wasChanged : true,
        email : "",
        userID : null,
    },
    reducers:{
        setEmail(state, action){
            state.email = action.payload
        },

        setUserID(state, action){
            state.userID = action.payload
        },

        setChanged(state){
            state.wasChanged = !state.wasChanged
        },

        setUsers(state, action){
            state.users = action.payload.data
        },

        setPosts(state, action){
            state.posts = action.payload.data
        },

        setComments(state, action){
            state.comments = action.payload.data
        },

        addComment(state, action){
            if(state.comments && state.comments.length>0){
                state.comments = [action.payload, ...state.comments]
            }
            else{
                state.comments = [action.payload]
            }
            const post_id = action.payload?.post_id
            let post = state.posts.find(post => post.id == post_id)
            post.comments.push(post)
        },

        addPost(state, action){
            if(state.posts && state.posts.length>0){
                state.posts = [action.payload, ...state.posts]
            }
            else{
                state.posts = [action.payload]
            }
        },

        updateReaction: (state, action) => {
                const { postId, reaction } = action.payload;
                const post = state?.posts.find(post => post.id == postId);
                if (!post) return;
                if (reaction === true) {
                    post.likes += 1;
                } 
                else if (reaction === false) {
                    post.dislikes += 1;
                }
                post.userReaction = reaction;
            },



    }
}
)

export const { setUsers, setPosts, setSelfUser, setComments, resetState, setChanged, setEmail, addComment, addPost, setUserID, updateReaction} = mainSlice.actions;
export const mainReducer = mainSlice.reducer;