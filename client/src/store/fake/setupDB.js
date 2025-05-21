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
        createUser(user.email, user.password, user.is_admin)
    });
    posts.forEach(post => {
        createPost(post.name, post.author_id, post.body, post.category_id)
    });
    comments.forEach(comment => {
        createComment(comment.post_id, comment.author_id, comment.body)
    });
}