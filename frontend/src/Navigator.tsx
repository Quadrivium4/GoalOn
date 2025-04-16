import AppNavigator from './AppNavigator';
import { useAuth } from './context/AuthContext';
import AuthNavigator from './AuthNavigator';
import { useEffect } from 'react';
import { DaysProvider } from './context/DaysContext';

const loader = document.getElementById("app-loader");
export const removeLoader = () =>{
    if(!loader) return;
    loader.style.display = "none"
}
export const setLoader = () =>{
    if(!loader) return;
    loader.style.display = "flex"
}
const Navigator = () =>{
    const {logged, user, loading} = useAuth();
    useEffect(()=>{
        //console.log("navigator",{logged})
    }, [logged])
    useEffect(() =>{
        if(!loader) return
        if(loading) setLoader()
        else if(!loading) removeLoader()

    },[loading])
    if(loading) return null;

    return (
        <>
        {logged && user? 
            <DaysProvider>
                <AppNavigator />
            </DaysProvider>
        : <AuthNavigator/>}</>

    )
}
export default Navigator