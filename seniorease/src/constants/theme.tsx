import React, { createContext, useContext, useState } from 'react';

type ThemeContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: {
    background: string;
    primary: string;
    primaryHover: string;
    text: string;
    textSecondary: string;
    cardBackground: string;
    border: string;
    buttonText: string;
    error: string;
    success: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    pill: number;
  };
  typography: {
    fontFamilyRegular: string;
    fontFamilyBold: string;
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
    primaryHover: '#B54600',
    text: isDarkMode ? '#F5F5F5' : '#2C3E50',
    textSecondary: isDarkMode ? '#AAAAAA' : '#666666',
    cardBackground: isDarkMode ? '#1E1E1E' : '#FFFFFF',
    border: isDarkMode ? '#333333' : '#D4D9E2',
    buttonText: '#FFFFFF',
    error: '#D32F2F',
    success: '#388E3C',
  };

  const spacing = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const borderRadius = {
    sm: 8,
    md: 12,
    lg: 20,
    pill: 50,
  };

  const typography = {
    fontFamilyRegular: 'Montserrat_400Regular',
    fontFamilyBold: 'Montserrat_700Bold',
  };

  return (
    <ThemeContext.Provider
      value={{
        fontSize,
        setFontSize,
        isDarkMode,
        toggleDarkMode,
        colors,
        spacing,
        borderRadius,
        typography,
      }}
    >
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