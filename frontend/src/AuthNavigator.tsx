import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register/Register';
import Verify from './auth/Verify';
import ResetPassword from './auth/ResetPassword';
import VerifyResetPassword from './auth/VerifyResetPassword';

const authRouter = createBrowserRouter([{
    path: "/login",
    element: <Login />
}, {
    path: "/*",
    element: <Register />
}, {
    path: "/verify/:userId/:token",
    element: <Verify />
},{
    path: "/reset-password",
    element: <ResetPassword />
},{
    path: "/verify-password/:userId/:token",
    element: <VerifyResetPassword />
}])
const AuthNavigator = () =>{
    return (
        <div id='auth-page'>
        <RouterProvider router={authRouter}></RouterProvider>
        </div>
    )
}
export default AuthNavigator