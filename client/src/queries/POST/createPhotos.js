import axios from "axios";
import { BASE_URL } from "../../config";

const createPhotos = async ({photos, id}) => {
    const MAX_FILES = 5;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if(!id){
        throw new Error("Передан невалидный id")
    }
    const formData = new FormData();
    let counter = 0;

    for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        if (photo.size > MAX_FILE_SIZE) {
            continue;
        }
        if(counter === MAX_FILES){
            break;
        }
        formData.append('photos[]', photo);
        counter++;
    }

    try {
        const token = localStorage.getItem("token")
        if (!token){
            throw new Error("Пользователь не аутентифицирован")
        }
        const response = await axios.post(
            `${BASE_URL}/api/posts/${id}/photos`, 
            formData,
            {
                headers:{
                    Authorization: `Bearer ${token}`,
                }
            }
        );
        //console.log("Photos sent:", response);
        return response.data;
    } catch (error) {
        console.error("Error sending photos:", error.response?.data?.error || error.message);
        throw error;
    }
};

export default createPhotos;