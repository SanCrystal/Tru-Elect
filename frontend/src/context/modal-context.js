import { createContext,useContext,useState} from "react";

const ModalContext = createContext();

export const ModalProvider = ({children}) => {
    const [showModal,setShowModal] = useState(false);

    const showModalHandler = ()=> setShowModal(true);
    const closeModalHandler = ()=> setShowModal(false);


    return <ModalContext.Provider value={{showModalHandler,closeModalHandler,showModal}}>{children}</ModalContext.Provider>
}


//custom hook to consume the modal context in our app
export const useModalContext = () => useContext(ModalContext);

