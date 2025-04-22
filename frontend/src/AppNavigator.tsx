import { createBrowserRouter, BrowserRouter, Routes, Route} from 'react-router-dom';
import Goals from './pages/Goals/Goals';
import Stats from './pages/Stats/Stats';
import Settings from './pages/Settings/Settings';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Friends from './pages/Friends/Friends';
import User from './pages/User/User';


const appRouter = createBrowserRouter([{
    path: "/*",
    element: <Goals />
},{
    path: "/stats",
    element: <Stats />
},{
    path: "/friends",
    element: <Friends />
},{
    path: "/settings",
    element: <Settings />
},{
    path: "/user/:userId",
    element: <User />
}]);
const AppNavigator = () =>{
    return (
        <>
        {/* <div>{mode}</div>
        <div>{window.screen.width + " " + window.innerWidth}</div> */}
        <BrowserRouter>
        {window.screen.width >= 500?<Header></Header> : null}
        <Routes>
        <Route path='/*' element={<Goals />}></Route>
        <Route path='/stats' element={<Stats />}></Route>
        <Route path='/settings' element={<Settings/>}></Route>
        <Route path='/friends' element={<Friends />}></Route>
        <Route path='/user/:userId' element={<User />}></Route>
        </Routes>
        {window.screen.width <= 500?<Footer></Footer> : null}
        </BrowserRouter>
       
        </>
        
    )
}
export default AppNavigator