import { createContext, useContext, useState } from "react";

const DraftContext = createContext();

export const DraftProvider = ({ children }) => {
  const [draftData, setDraftData] = useState(null);

  const openDraft = (data) => {
    setDraftData(data);
  };

  const clearDraft = () => {
    setDraftData(null);
  };

  return (
    <DraftContext.Provider value={{ draftData, openDraft, clearDraft }}>
      {children}
    </DraftContext.Provider>
  );
};

export const useDraft = () => useContext(DraftContext);
