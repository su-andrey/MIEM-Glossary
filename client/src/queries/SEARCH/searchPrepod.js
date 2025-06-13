import axios from "axios";
import { BASE_URL } from "../../config";

const searchPrepod = async (name) => {

    const isThreeWords = (str) => {
        return /^[А-Яа-яееA-Za-z]+ [А-Яа-яееA-Za-z]+ [А-Яа-яееA-Za-z]+$/.test(str.trim());
    }

    try{
        if(!name || name.length===0){
            throw new Error("invalid name")
        }
        if(!isThreeWords(name)){
            throw new Error("invalid name format")
        }
        const url = `${BASE_URL}/api/find_teacher`;
        const data = {
            target: name,
        }
        const response = await axios.post(
            url,
            data
        );
        if (!response.data || !response.data.link) {
            throw new Error("Prepod not found");
        }
        return response.data;
    } 
    catch(error){
        const message =
            error.response?.status === 400
                ? "Преподаватель не найден"
                : error.response?.data?.error || "Что-то пошло не так";

        console.error("searchPrepod error:", message);
        throw new Error(message);
    }
};

export default searchPrepod;