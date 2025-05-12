import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './pages/layout/Layout.jsx';
import LogInPage from './pages/logInPage/LogInPage.jsx';
import RegisterPage from './pages/registerPage/RegisterPage.jsx';
import HomePage from './pages/homePage/HomePage.jsx';
import PrepodPage from './pages/prepodPage/PrepodPage.jsx';
import FoodMainPage from './pages/foodMainPage/FoodMainPage.jsx';
import FoodCataloguePage from './pages/foodCataloguePage/FoodCataloguePage.jsx';
import QuestionPage from './pages/questionPage/QuestionPage.jsx';
import CabinetPage from './pages/cabinetPage/CabinetPage.jsx';
import NotFoundPage from './pages/notFoundPage/NotFoundPage.jsx';
import SingleQuestionPage from './pages/pageComponents/singleQuestionPage/SingleQuestionPage.jsx';
import SingleFoodPage from './pages/pageComponents/singleFoodPage/SingleFoodPage.jsx';
import SinglePrepodPage from './pages/pageComponents/singlePrepodPage/SinglePrepodPage.jsx';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setPosts, setComments } from './store/mainSlice.js';
import requireComments from './queries/GET/requireComments.js';
import requirePosts from './queries/GET/requirePosts.js';
import requireUsers from './queries/GET/requireUsers.js';
import RequireAuth from './hoc/RequireAuth.jsx';
const App = () => {
    const dispatch = useDispatch();
/*
    useEffect(()=>{
        dispatch(setUsers(requireUsers()))
        dispatch(setPosts(requirePosts()))
        dispatch(setComments(requireUsers()))
    }, []);
*/

    return (<>
    <Routes>
        <Route path="*" element={<NotFoundPage />}></Route>
        <Route path="/" element={<Layout></Layout>}>
            <Route index element={<HomePage></HomePage>}></Route>

            <Route path="/login" element={<LogInPage></LogInPage>}></Route>
            <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>

            <Route path="prepods" element={<PrepodPage />}></Route>
            <Route path="prepods/:id" element={<SinglePrepodPage/>}></Route>

            <Route path="food" element={<FoodMainPage />}></Route>
            <Route path="food/:category" element={<FoodCataloguePage />}></Route>
            <Route path="food/:category/:id" element={<SingleFoodPage />}></Route>

            <Route path="questions" element={<QuestionPage />}></Route>
            <Route path="questions/:id" element={<SingleQuestionPage />}></Route>

            <Route path="cabinet" element={<CabinetPage />}></Route>
        </Route>
    </Routes>
    </>);
}

export default App;