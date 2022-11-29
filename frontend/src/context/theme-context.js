import { createContext,useContext,useReducer,useEffect} from "react";
import { themeReducer } from "./themeReducer";
export const ThemeContext = createContext();


let initialThemeState = localStorage.getItem("theme")? JSON.parse(localStorage.getItem("theme")):{primary:'color-1',background:'bg-1'}

export const ThemeProvider = ({children}) => {
    const [themeState,dispatchTheme] = useReducer(themeReducer,initialThemeState);

    const themeHandler = buttonClassName=> dispatchTheme({type: buttonClassName});
      
    
    //localstorage update
    useEffect(()=>{
        localStorage.setItem("theme",JSON.stringify(themeState));
    },[themeState.primary, themeState.background,themeState])

    return <ThemeContext.Provider value={{themeState,themeHandler}}>{children}</ThemeContext.Provider>
}


//custom hook to use theme context
export const useThemeContext = () => useContext(ThemeContext);