const useLocalStorage = (key) => {
    const setItem = (value) => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(error);
        }
    };

    const getItem = () => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } 
        catch (error) {
            console.error(error);
            return null;
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(error);
        }
    };

    return {
        setItem,
        getItem,
        removeItem,
    };
};

export default useLocalStorage;