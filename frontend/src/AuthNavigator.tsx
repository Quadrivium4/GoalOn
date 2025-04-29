import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register/Register';
import Verify from './auth/Verify';
import ResetPassword from './auth/ResetPassword';
import VerifyResetPassword from './auth/VerifyResetPassword';
import LandingPage from './auth/LandingPage';
import DeleteAccount from './shared/DeleteAccount';
import DownloadPage from './auth/DownloadPage';

const authRouter = createBrowserRouter([{

    path: "/:reload?/*",
    element: <LandingPage />

},
{
    path: "/download",
    element: <DownloadPage />
},
{
    path: "/login",
    element: <Login />
}, {
    path: "/register",
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
},   {
    path: "/delete-account/:id/:token",
    element: <DeleteAccount />
}])

export const Header = () =>{
    return (
    <div id="header">
        <a href='/'><h1 className="logo">G<span>o</span>al</h1></a>
        <div className="nav-links">

        </div>
      </div>
    )
}
export const Footer = () =>{
    return (
    <div id="auth-footer" style={{display: "flex", justifyContent: "center", gap: 20, backgroundColor: "rgb(30,30,30)", padding: 10, flexWrap: "wrap", marginTop: "auto"}}>
        <p>@{new Date().getFullYear()} Goal</p>
        <p>All rights reserved</p>
        <a href={"https://www.termsfeed.com/live/36640761-198d-4cd0-bf16-e27ddf2872ba"} target='_blank'>Privacy Policy</a>
        <p>Email: goal.getinfo@gmail.com</p>
        {/* <a href='/'><h1 className="logo">G<span>o</span>al</h1></a> */}
      </div>
    )
}
const AuthNavigator = () =>{
    return (
        <>
        <Header />
        <div id='auth-page'>
        <RouterProvider router={authRouter}></RouterProvider>
        </div>
        <Footer />
        </>
    )
}
export default AuthNavigator