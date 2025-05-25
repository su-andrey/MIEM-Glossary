import axios from "axios";
import { BASE_URL } from "../../config";

const requirePhotos = async (id) => {
    if(!id){
        throw new Error("Передан невалидный id")
    }

    try {
        const response = await axios.get(
            `${BASE_URL}/api/posts/${id}/photos`
        );
        console.log("Photos received:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error receiving photos:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default requirePhotos;