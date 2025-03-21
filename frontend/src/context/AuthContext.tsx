import { createContext, useContext, Reducer, useReducer, useEffect, ReactNode} from "react";
import { baseUrl, protectedUrl } from "../constants";
import { api, protectedApi } from "../utils";
import { useMessage } from "./MessageContext";
import { TGoal } from "../controllers/goals";
import { redirect } from "react-router-dom";
const authState: TAuthStateProps = {
    logged: false,
    loading: true,
    aToken: null,
    user: null
}
export type TUser = {
    _id: string
    name: string
    email: string
    profileImg: string,
    goals: TGoal[],
    friends: string[],
    outgoingFriendRequests: string[],
    incomingFriendRequests: string[]

}
type TAuthStateProps = {
    logged: boolean,
    loading: boolean,
    aToken: string | null,
    user: TUser | null // to do: togliere null
}
type TLoginForm = {
    email: string, 
    password: string
}
export type TRegisterForm = {
    name: string,
    email: string, 
    password: string,
}
export type TVerifyProps = {
    id: string,
    token: string
}
export type TUserAuthResponse = {
    user: TUser,
    aToken: string
}
type ContextProps = TAuthStateProps & {
    login: (form: TLoginForm) =>Promise<void>, 
    register: (form: TRegisterForm) => Promise<void>,
    logout: () => Promise<void>, 
    verify: (credentials: TVerifyProps) =>{}, 
    deleteAccount: () =>{}, 
    updateUserProfileImage: (id: string) => void,
    updateUser: (user: TUser) => void,
    setLoading: (state: boolean) =>void
} | null;
const AuthContext = createContext<ContextProps>(null);
type TActionProps = {
    type: "LOGIN" | "LOGGED_OUT" | "TOGGLE_LOADING" | "SET_LOADING" | "SET_PROFILE_IMAGE" | "SET_USER" | "SET_MODE"
    payload?: any
}
const authReducer: Reducer<TAuthStateProps, TActionProps> =  (state, action) =>{
    //console.log("dispatching...", action)
    switch (action.type) {
        case "SET_PROFILE_IMAGE": 
            if(!state.user) return state;
            return {...state, user: {...state.user, profileImg: action.payload}}
        case "LOGIN": 
            return  {...state, loading: false, logged: true, aToken: action.payload.aToken, user: action.payload.user}!
        case "LOGGED_OUT": 
            return {...authState, loading: false}
        case "TOGGLE_LOADING": 
            return {...state, loading: !state.loading}
        case "SET_LOADING":
            return {...state, loading: action.payload}
        case "SET_USER": 
            return {...state, user: action.payload}
        default:
            return state
    }
    
}
const AuthProvider = ({children } : {children: ReactNode}) =>{
    const [state, dispatch] = useReducer(authReducer, authState);
    const {message} = useMessage()
    useEffect(()=>{
        //if(!state.logged && state.loading){
                isLogged()
        //}
    },[])
    const isLogged = async () => {
        const aToken =  localStorage.getItem("aToken");
        //console.log({aToken})
        if (!aToken) return dispatch({ type: "LOGGED_OUT" });
        try {
             const res = await protectedApi().get(`${protectedUrl}/user`);
             let user = res.data;
        //console.log({user})
        if (!user) return dispatch({ type: "LOGGED_OUT" });
        //dispatch({type: "LOGGED_OUT"})
        localStorage.setItem("user", JSON.stringify(user));
        dispatch({ type: "LOGIN", payload: { aToken, user } });
        } catch (error) {
        
            return dispatch({ type: "LOGGED_OUT" });
        }
        
    };
    const login = async({email, password}: TLoginForm) =>{
        try {
            const res = await api.post(`${baseUrl}/login`,{ email, password });
            const { user, aToken }: TUserAuthResponse= res.data;
            console.log({ user, aToken });
            localStorage.setItem("aToken", aToken);
            dispatch({ type: "LOGIN", payload: { aToken, user } });
        } catch (err) {
            throw err
        }
    }
    // const loginWithGoogle = async(accessToken: string) =>{
    //     const {user, aToken} = await signInWithGoogle(accessToken);
    //     //console.log({ user, aToken });
    //     localStorage.setItem("aToken", aToken);
    //     dispatch({ type: "LOGIN", payload: { aToken, user } });
    //     //return { user, aToken };
    // }
    const register = async({name, email, password}: TRegisterForm) =>{
        const {user} : {user: TUser} = await api.post(`${baseUrl}/register`, {name, email, password});
        console.log("successfully registered", user);
        //SecureStore.setItemAsync("aToken", aToken);
    }
    const logout = async() =>{
        console.log({state})
        await protectedApi().get(`${protectedUrl}/logout`);
        console.log("log out")
        localStorage.removeItem("aToken");
        dispatch({type: "LOGGED_OUT"})
        redirect("/login")
    }
    const verify = async({id, token}: TVerifyProps) =>{
        const res =  await api.post(`${baseUrl}/verify`, {token, id});
        const {user, aToken}: TUserAuthResponse = res.data;
        console.log({user, aToken})
        localStorage.setItem("aToken", aToken);
        dispatch({type: "LOGIN", payload: {aToken, user}})
    }
    const deleteAccount = async() =>{
        await api.delete(`${protectedUrl}/user`);
        console.log("User delted succesfully");
        localStorage.removeItem("aToken");
        dispatch({type: "LOGGED_OUT"});
    }
    const updateUserProfileImage = (id: string) =>{
        dispatch({type: "SET_PROFILE_IMAGE", payload: id})
    }
    const updateUser = (newUser: TUser) =>{
        dispatch({type: "SET_USER", payload: newUser});
    }
    const setLoading = (state: boolean) =>{
        dispatch({type: "SET_LOADING", payload: state})
    }
    return (
        <AuthContext.Provider value={{...state, login, register, logout, verify, deleteAccount,  updateUserProfileImage, updateUser, setLoading}}>
                {children}
        </AuthContext.Provider>
    )
}
const useAuth = () =>{
    const authContext = useContext<ContextProps>(AuthContext);
    if(!authContext) throw new Error("useAuth shoud be used inside AuthContext!")
    return authContext
}
const useUser = () =>{
    const {user} = useAuth();
    if(!user) throw new Error("user is not valid!")
    return user;
}
export {
    AuthProvider,
    useAuth,
    useUser
}