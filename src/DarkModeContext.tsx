import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';

interface DarkModeContextValue {
  darkMode: boolean;
  setDarkMode: Dispatch<SetStateAction<boolean>>;
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeContext;
