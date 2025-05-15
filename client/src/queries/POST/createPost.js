import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const createPost = async (name, author_id, body, category_id) => {
    if (!name || !author_id || !body || !category_id) {
        throw new Error("Missing required post fields");
    }

    const data = { name, author_id, body, category_id };

    try {
        const response = await axios.post(`${BASE_URL}/posts`, data);
        console.log("Post created:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createPost;