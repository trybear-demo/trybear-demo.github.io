import { createContext, useContext, useState } from 'react';

const CursorContext = createContext({
  cursorVariant: 'default',
  setCursorVariant: () => {},
  cursorTheme: 'default',
  setCursorTheme: () => {},
  cursorText: '',
  setCursorText: () => {},
});

export const CursorProvider = ({ children }) => {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorTheme, setCursorTheme] = useState('default');
  const [cursorText, setCursorText] = useState('');

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant, cursorTheme, setCursorTheme, cursorText, setCursorText }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => useContext(CursorContext);
