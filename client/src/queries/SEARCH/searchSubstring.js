import { BASE_URL } from "../../config";
import axios from "axios";

const searchSubstring = async (search) => {
    try {
        const url = `${BASE_URL}/api/posts/search?str=${encodeURIComponent(search)}`;
        const response = await axios.get(url);
        const data = response.data;

        if (!Array.isArray(data)) {
            console.warn("Expected array, but got:", data);
            return []; 
        }

        const filtered = data.filter(post => !!post?.is_moderated);
        console.log("Filtered results:", filtered);
        return filtered;
    } catch (error) {
        console.error(error.response?.data?.error || error.message);
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};

export default searchSubstring;