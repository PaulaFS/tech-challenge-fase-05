import React, { createContext, useContext, useState } from 'react';

type ThemeContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    primary: string;
    text: string;
    cardBackground: string;
    border: string;
    buttonText: string;
  };
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(15);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const colors = {
   background: isDarkMode ? '#121212' : '#FFF9F0',
    primary: '#D35400', 
    text: isDarkMode ? '#F5F5F5' : '#2C3E50',
    cardBackground: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#D4D9E2',
    buttonText: '#FFFFFF',
  };

  return (
    <ThemeContext.Provider value={{ fontSize, setFontSize, isDarkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}