import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const editPost = async (name, author_id, body, category_id, post_id) => {
    if (!name || !author_id || !body || !category_id || !post_id) {
        throw new Error("Missing required post fields");
    }

    const data = { name, author_id, body, category_id };

    try {
        const response = await axios.put(`${BASE_URL}/posts/${post_id}`, data);
        console.log("Post edited:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error editing post:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default editPost;