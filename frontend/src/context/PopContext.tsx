import {
    createContext,
    useContext,
    useState,
    ReactNode
} from "react";
type PopStateProps = {
    title?: string,
    content: React.ReactNode,
}
type PopContextProps = PopStateProps & {
    setPop: (children: React.ReactNode, title?: string) => void,
    closePop: () =>void
} | null;
const PopContext = createContext<PopContextProps>(null);

const PopProvider = ({ children }: {children: ReactNode}) => {
    const [state, setState] = useState<PopStateProps>({content: null});
    //const delay = 5000;
   const setPop = (children: React.ReactNode, title?: string) => {
        setState({content: children, title})
   }
   const closePop = () => setState({content: undefined})
    return (
        <PopContext.Provider value={{ ...state,setPop, closePop}}>
            {children}
        </PopContext.Provider>
    );
};
const usePop = () => {
    const popContext = useContext(PopContext);
    if(!popContext) throw new Error("usePop shoud be used inside PopContext!")
    return popContext
};
export { PopProvider, usePop };
