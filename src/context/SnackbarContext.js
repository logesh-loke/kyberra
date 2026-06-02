import { createContext, useContext, useState } from "react";

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState(null);

  return (
    <SnackbarContext.Provider value={{ snackbar, setSnackbar }}>
      {children}
      {snackbar}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}