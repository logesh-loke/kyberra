import React, { createContext, useContext, useState } from 'react';

const NotifyContext = createContext();

export function NotifyProvider({ children }) {
  const [notify, setNotify] = useState(null);

  return (
    <NotifyContext.Provider value={{ notify, setNotify }}>
      {children}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const context = useContext(NotifyContext);
  if (!context) {
    throw new Error('useNotify must be used within NotifyProvider');
  }
  return context;
}