export const BASE_URL = import.meta.env.VITE_ENV == "production" || import.meta.env.VITE_ENV == undefined 
    ? "/api" 
    : import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_API_PORT + "/api"