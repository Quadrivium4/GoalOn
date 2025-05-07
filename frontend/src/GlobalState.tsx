import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
type MessageStateProps = {
    content: string |null,
    hello: string
}
type MessageContextProps = MessageStateProps & {
    message: () =>void
} | null
const GlobalContext = createContext<MessageContextProps>(null);

const GlobalProvider = ({ children }: {children: ReactNode}) => {
    const [state, setState] = useState<MessageStateProps>({content: "global", hello: "hello"});
    //const delay = 5000;
    const message = () =>{
        console.log("Hi message global");
        setState({...state, content: "new global" + "1"})
    }
    return (
        <GlobalContext.Provider value={{ ...state, message }}>
            {children}
        </GlobalContext.Provider>
    );
};
const useGlobal = () => {
    const messageContext = useContext(GlobalContext);
    if(!messageContext) throw new Error("useMessage shoud be used inside MessageContext!")
    return messageContext
};
export { GlobalProvider, useGlobal };
