import  { createContext, useState, useRef, useEffect, useContext } from 'react';



const ClickContext = createContext();

export const ClickProvider = ({ children }) => {

     const [isOpen, setIsOpen] = useState(false);
     const ref = useRef(null);

     const open = () => setIsOpen(true);
     const close = () => setIsOpen(false);
     const toggle = (value) =>{
       setIsOpen(prev => !prev);
    } 
      

   // Close when clicked outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

    return (
        <ClickContext.Provider value={{open, setIsOpen, close, toggle, isOpen, ref}}>
            {children}
        </ClickContext.Provider>
    )
}

export const useClickContext = () => {
    return useContext(ClickContext);
}