import createCategory from "../POST/createCategory";
import createComment from "../POST/createComment";
import createPost from "../POST/createPost";
import comments from "../../store/fake/comments";
import posts from "../../store/fake/posts";
import users from "../../store/fake/users";
import categories from "../../store/fake/categories";
import createUser from "../POST/createUser";

const setupDB = ()=>{
    for(const category of categories){
        createCategory(category.name, category.category_id)
    }
    
    for (const user of users){
        createUser(user.name, user.author_id, user.password, user.is_admin)
    }

    for (const post of posts){
        createPost(post.name, post.author_id, post.body, post.category_id)
    }


    for (const comment of comments){
        createComment(comment.post_id, comment.author_id, comment.body)
    }


    
}
export default setupDB