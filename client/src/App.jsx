import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import Layout from './pages/layout/Layout.jsx';
import HomePage from './pages/homePage/HomePage.jsx';
import PrepodPage from './pages/prepodPage/PrepodPage.jsx';
import FoodPage from './pages/foodPage/FoodPage.jsx';
import FoodCataloguePage from './pages/foodCataloguePage/FoodCataloguePage.jsx';
import QuestionPage from './pages/questionPage/QuestionPage.jsx';
import CabinetPage from './pages/cabinetPage/CabinetPage.jsx';
import NotFoundPage from './pages/notFoundPage/NotFoundPage.jsx';
import SingleQuestionPage from './pages/pageComponents/singleQuestionPage/SingleQuestionPage.jsx';
import SingleFoodPage from './pages/pageComponents/singleFoodPage/SingleFoodPage.jsx';
import SinglePrepodPage from './pages/pageComponents/singlePrepodPage/SinglePrepodPage.jsx';




const App = () => {
    return (<>
    <Routes>
        <Route path="*" element={<NotFoundPage />}></Route>
        <Route path="/" element={<Layout></Layout>}>
            <Route index element={<HomePage></HomePage>}></Route>

            <Route path="prepods" element={<PrepodPage />}></Route>
            <Route path="prepods/:id" element={<SinglePrepodPage/>}></Route>

            <Route path="food" element={<FoodPage />}></Route>
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