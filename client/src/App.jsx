import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Suspense, lazy, use } from 'react';
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
import RequireAdmin from "./hoc/RequireAdmin.jsx"
import Loader2 from './components/UI/loader2/Loader2.jsx';
import Loader1 from './components/UI/loader1/Loader1.jsx';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setPosts, setComments } from './store/mainSlice.js';
import requireComments from './queries/GET/requireComments.js';
import requirePosts from './queries/GET/requirePosts.js';
import RequireAuth from './hoc/RequireAuth.jsx';
import getMe from './queries/USER/getMe.js';
import useSmoothScroll from './custom hooks/useSmoothScroll.js';
import { setChanged } from './store/mainSlice.js';
import setupDB from './store/fake/setupDB.js';
import AdminPage from './pages/adminPage/AdminPage.jsx';



const App = () => {
    const dispatch = useDispatch();
    let wasChanged = useSelector(state => state.main.wasChanged);


    useEffect(() => {
        if(wasChanged) {
            const updateData = async () => {
                try {
                    const posts = await requirePosts();
                    const comments = await requireComments();
                    localStorage.removeItem('persist:root')
                    dispatch(setPosts({data: posts}));
                    dispatch(setComments({data:comments}));
                    console.log("Storage rebuilt");
                } catch (error) {
                    console.error("Ошибка при обновлении данных:", error);
                }
            };
            updateData();
            dispatch(setChanged());
        }
    }, [wasChanged]);


    useSmoothScroll()


    return (
    
    <Routes>
        <Route path="*" element={<NotFoundPage />}></Route>
        <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Suspense fallback={<Loader2 />}><HomePage></HomePage></Suspense>}></Route>

            <Route path="/login" element={<LogInPage></LogInPage>}></Route>
            <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>

            <Route path="prepods" element={<Suspense fallback={<Loader1 />}><PrepodPage /></Suspense>}></Route>
            <Route path="prepods/:id" element={<Suspense fallback={<Loader1 />}><SinglePrepodPage/></Suspense>}></Route>

            <Route path="food" element={<Suspense fallback={<Loader1 />}><FoodMainPage /></Suspense>}></Route>
            <Route path="food/:category" element={<Suspense fallback={<Loader1 />}><FoodCataloguePage /></Suspense>}></Route>
            <Route path="food/:category/:id" element={<Suspense fallback={<Loader1 />}><SingleFoodPage /></Suspense>}></Route>

            <Route path="questions" element={<Suspense fallback={<Loader1 />}><QuestionPage /></Suspense>}></Route>
            <Route path="questions/:id" element={<Suspense fallback={<Loader1 />}><SingleQuestionPage /></Suspense>}></Route>

            <Route path="cabinet" element={<Suspense fallback={<Loader1 />}><RequireAuth> <CabinetPage /> </RequireAuth></Suspense>}></Route>
            <Route path="admin" element={<Suspense fallback={<Loader1 />}><RequireAuth><RequireAdmin>   <AdminPage />   </RequireAdmin></RequireAuth></Suspense>}></Route>
        </Route>
    </Routes>
    );
}

export default App;