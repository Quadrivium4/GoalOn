import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register/Register';
import Verify from './auth/Verify';

const authRouter = createBrowserRouter([{
    path: "/login",
    element: <Login />
}, {
    path: "/",
    element: <Register />
}, {
    path: "/verify/:userId/:token",
    element: <Verify />
}])
const AuthNavigator = () =>{
    return (
        <div className='page'>
        <RouterProvider router={authRouter}></RouterProvider>
        </div>
    )
}
export default AuthNavigator