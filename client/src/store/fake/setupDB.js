import categories from "./categories";
import comments from "./comments";
import posts from "./posts";
import users from "./users";
import createCategory from "../../queries/POST/createCategory";
import createComment from "../../queries/POST/createComment";
import createPost from "../../queries/POST/createPost";
import createUser from "../../queries/POST/createUser";

export default function setupDB(){
    users.forEach(user => {
        createUser(user)
    });
    posts.forEach(post => {
        createPost(post)
    });
    comments.forEach(comment => {
        createComment(comment)
    });
}