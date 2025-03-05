import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
type MessageStateProps = {
    content: string |null,
    type: "error" | "success" | "warning" |null
}
type MessageContextProps = MessageStateProps & {
    message: {
        error: (msg: string) => void
        success: (msg: string) => void
        warning: (msg: string) => void
    }
} | null
const MessageContext = createContext<MessageContextProps>(null);

const MessageProvider = ({ children }: {children: ReactNode}) => {
    const [state, setState] = useState<MessageStateProps>({content: null, type: null});
    //const delay = 5000;
    const message = {
        error: (message: string) => {
            console.log("new error message dispatched", message)
            setState({ content: message, type: "error" });
        },
        success: (message: string) => {
            setState({ content: message, type: "success" });
        },
        warning: (message: string) => {
            setState({ content: message, type: "warning" });
        },
    };
    return (
        <MessageContext.Provider value={{ ...state, message }}>
            {children}
        </MessageContext.Provider>
    );
};
const useMessage = () => {
    const messageContext = useContext(MessageContext);
    if(!messageContext) throw new Error("useMessage shoud be used inside MessageContext!")
    return messageContext
};
export { MessageProvider, useMessage };
