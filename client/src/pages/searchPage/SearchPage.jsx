import { useEffect, useState } from "react";
import SearchField from "../../components/UI/searchField/SearchField";
import styles from "./searchPage.module.css"
import glass from "./../../assets/vectors/glass_light_grey.svg"
import ActionButton from "../../components/UI/actionButton/ActionButton";
import searchPrepod from "../../queries/SEARCH/searchPrepod";
import searchSubstring from "../../queries/SEARCH/searchSubstring";
import SearchCard from "../../components/searchCard/SearchCard";
import { uid } from "uid";
import { useSearchParams } from "react-router-dom";
import crystal from "./../../assets/png/crystals/crystal5.png"

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [search, setSearch] = useState("")
    const [checkbox, setCheckbox] = useState(false)
    const [name, setName] = useState("")
    const [surname, setSurname] = useState("")
    const [patronimic, setPatronimic] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [prepodResult, setPrepodResult] = useState("")
    const [loading, setLoading] = useState(false)
    const [prepodError, setPrepodError] = useState(false)


        useEffect(() => {
        if (query.length > 0) {
            setSearch(query)
            handleSearch(query)
        }
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleSearch(search);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [search]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPrepodError(false)
        try{
            const fullName = `${surname} ${name} ${patronimic}`.trim()
            console.log(fullName)
            const linka = await searchPrepod(fullName)
            if(!linka.link){
                throw new Error("Prepod not found")
            }
            console.log(linka)
            setPrepodResult(linka)
        }
        catch(error){
            console.error(error.message);
            setPrepodError(true);
            setPrepodResult("");
        }
        finally{
            setLoading(false)
        }

    }

    const handleNameChange = (e) => {
        setName(e.target.value)
    }

    const handleSurnameChange = (e) => {
        setSurname(e.target.value)
    }

    const handlePatronimicChange = (e) => {
        setPatronimic(e.target.value)
    }

    const handleCheckboxChange = (e) => {
        setCheckbox(e.target.checked)
    }

    const handleSearchChange = async (e) => {
        const value = e.target.value;
        setSearch(value);
        try {
            const res = await searchSubstring(value);
            setSearchResults(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearch = async (str) => {
        try{
            setLoading(true)
            setSearch(str)
            const res = await searchSubstring(str)
            console.log(res, "резы ручного поиска")
            setSearchResults(res)
        }
        catch(error){
            console.error(error)
        }
        finally{
            setLoading(false)
        }
    }


    return (
        <div className={styles.wrapper}>
            <img src={crystal} alt="crystal" className={styles.crystal} />
            <div className={styles.title}>
                Поиск
            </div>
            <div className={styles.logicalBlock}>
                <div className={styles.checkboxBlock}>
                    <input type="checkbox"  className={styles.checkbox} style={{minWidth: "1em"}} onChange={(e)=>{handleCheckboxChange(e)}}/>
                    <div className={styles.subtitle}>
                        Поиск конкретного препода
                    </div>
                </div>
            </div>
            {
                checkbox ? (
                    <>
                        <form className={styles.nameForm} onSubmit={handleSubmit}>
                            <div className={styles.subtitle}>
                                Пробьем падлу по ФИО
                            </div>
                            <input 
                                type="text" 
                                placeholder="Введите фамилию..." 
                                className={`${styles.field} ${styles.namefield}`} 
                                value={surname} 
                                onChange={handleSurnameChange}
                            />
                            <input 
                                type="text" 
                                placeholder="Введите имя..." 
                                className={`${styles.field} ${styles.namefield}`} 
                                value={name} 
                                onChange={handleNameChange}
                            />
                            <input 
                                type="text" 
                                placeholder="Введите отчество..." 
                                className={`${styles.field} ${styles.namefield}`} 
                                value={patronimic} 
                                onChange={handlePatronimicChange}
                            />
                            <ActionButton text={loading ? "Поиск..." : "Искать"} type="submit" disabled={loading}/>
                            {
                                prepodError &&
                                <div className={styles.error}>Упс, преподаватель не найден...</div>
                            }
                        </form>
                        {prepodResult && (
                            <div className={styles.logicalBlock}>
                                <div className={styles.subtitle}>
                                    Результат поиска:
                                </div>
                                <a href={prepodResult.link} className={styles.subtitle} target="_blank" rel="noopener noreferrer">
                                    <div className={styles.subtitle}>
                                        {prepodResult.link}
                                    </div>
                                </a>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className={styles.logicalBlock}>
                            <div className={styles.subtitle}>
                                Ищите по ключевым словам
                            </div>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="search"
                                    placeholder="Хочу найти..."
                                    className={styles.field}
                                    value={search}
                                    onChange={(e)=>handleSearchChange(e)}
                                />
                                <img
                                    draggable="false"
                                    src={glass}
                                    alt="glass icon"
                                    className={styles.glass}
                                />
                            </div>
                            <ActionButton text={loading ? "Поиск..." : "Искать"} onClick={()=>{handleSearch(search)}} disabled={loading}/>
                        </div>
                        <div className={styles.resultContainer}>
                            {(!searchResults || searchResults.length === 0) ?
                                <div className={styles.subtitle}>
                                    Упс, ничего не найдено...
                                </div>
                                :
                                (searchResults.map((post)=>{
                                    return(
                                        <SearchCard data={post} disabled={false} key={post?.id}/>
                                    )
                                }))
                            }
                        </div>
                    </>
                )
            }
        </div> 
    );
}

export default SearchPage;