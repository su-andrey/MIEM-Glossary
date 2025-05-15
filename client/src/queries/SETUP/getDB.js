import requireUsers from "../GET/requireUsers";
import requirePosts from "../GET/requirePosts";
import requireComments from "../GET/requireComments";
import requireCategory from "../GET/requireCategory";
const getDB = () => {
    requireCategory()
    requireUsers()
    requirePosts()
    requireComments()
}

export default getDB;


