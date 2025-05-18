import { createBrowserRouter, createRoutesFromElements, Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Suspense, lazy } from 'react';
const Layout = lazy(() => import('./pages/layout/Layout.jsx'));
const LogInPage = lazy(() => import('./pages/logInPage/LogInPage.jsx'));
const RegisterPage = lazy(() => import('./pages/registerPage/RegisterPage.jsx'));
const HomePage = lazy(() => import('./pages/homePage/HomePage.jsx'));
const PrepodPage = lazy(() => import('./pages/prepodPage/PrepodPage.jsx'));
const FoodMainPage = lazy(() => import('./pages/foodMainPage/FoodMainPage.jsx'));
const FoodCataloguePage = lazy(() => import('./pages/foodCataloguePage/FoodCataloguePage.jsx'));
const QuestionPage = lazy(() => import('./pages/questionPage/QuestionPage.jsx'));
const CabinetPage = lazy(() => import('./pages/cabinetPage/CabinetPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/notFoundPage/NotFoundPage.jsx'));
const SingleQuestionPage = lazy(() => import('./pages/pageComponents/singleQuestionPage/SingleQuestionPage.jsx'));
const SingleFoodPage = lazy(() => import('./pages/pageComponents/singleFoodPage/SingleFoodPage.jsx'));
const SinglePrepodPage = lazy(() => import('./pages/pageComponents/singlePrepodPage/SinglePrepodPage.jsx'));
import Loader from './components/UI/loader/Loader.jsx';
import { RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setPosts, setComments } from './store/mainSlice.js';
import requireComments from './queries/GET/requireComments.js';
import requirePosts from './queries/GET/requirePosts.js';
import requireUsers from './queries/GET/requireUsers.js';
import RequireAuth from './hoc/RequireAuth.jsx';
import setupDB from './queries/SETUP/setupDB.js';
import getDB from './queries/SETUP/getDB.js';
import useSmoothScroll from './custom hooks/useSmoothScroll.js';



const App = () => {
    const dispatch = useDispatch();
    let wasChanged = useSelector(state => state.main.wasChanged);

    useEffect(()=>{
        if(wasChanged){
            dispatch(setUsers(requireUsers()))
            dispatch(setPosts(requirePosts()))
            dispatch(setComments(requireUsers()))
        }
        wasChanged = false
    }, [wasChanged]);

    useSmoothScroll()
    return (<>
    <Routes>
        <Route path="*" element={<NotFoundPage />}></Route>
        <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Suspense fallback={<Loader />}><HomePage></HomePage></Suspense>}></Route>

            <Route path="/login" element={<LogInPage></LogInPage>}></Route>
            <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>

            <Route path="prepods" element={<Suspense fallback={<Loader />}><PrepodPage /></Suspense>}></Route>
            <Route path="prepods/:id" element={<Suspense fallback={<Loader />}><SinglePrepodPage/></Suspense>}></Route>

            <Route path="food" element={<Suspense fallback={<Loader />}><FoodMainPage /></Suspense>}></Route>
            <Route path="food/:category" element={<Suspense fallback={<Loader />}><FoodCataloguePage /></Suspense>}></Route>
            <Route path="food/:category/:id" element={<Suspense fallback={<Loader />}><SingleFoodPage /></Suspense>}></Route>

            <Route path="questions" element={<Suspense fallback={<Loader />}><QuestionPage /></Suspense>}></Route>
            <Route path="questions/:id" element={<Suspense fallback={<Loader />}><SingleQuestionPage /></Suspense>}></Route>

            <Route path="cabinet" element={<Suspense fallback={<Loader />}><RequireAuth> <CabinetPage /> </RequireAuth></Suspense>}></Route>
        </Route>
    </Routes>
    </>);
}

export default App;