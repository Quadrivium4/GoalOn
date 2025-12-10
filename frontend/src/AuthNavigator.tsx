import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register/Register';
import Verify from './auth/Verify';
import ResetPassword from './auth/ResetPassword';
import VerifyResetPassword from './auth/VerifyResetPassword';
import LandingPage from './auth/LandingPage';
import DeleteAccount from './shared/DeleteAccount';
import DownloadPage from './auth/DownloadPage';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';

const Layout = () =>(
    <>
         <Header></Header>
         <Outlet />
         <Footer></Footer>
    </>
)
const authRouter = createBrowserRouter([{
    element: <Layout />, 
    children: [{


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
},{
        path: "/privacy-policy",
        element: <PrivacyPolicy />
    }]}]
)

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
    <div id="auth-footer" style={{display: "flex", width: "100%", justifyContent: "center", gap: 20, backgroundColor: "rgb(30,30,30)", padding: 10, flexWrap: "wrap", marginTop: "auto"}}>
        <p>@{new Date().getFullYear()} Goal</p>
        <p>All rights reserved</p>
        <Link to={"/privacy-policy"}>Privacy Policy</Link>
        <p>Email: goal.getinfo@gmail.com</p>
        {/* <a href='/'><h1 className="logo">G<span>o</span>al</h1></a> */}
      </div>
    )
}
const AuthNavigator = () =>{
    return (
        <>
        <div id='auth-page'>
        <RouterProvider router={authRouter}></RouterProvider>
        </div>

        </>
    )
}
export default AuthNavigator