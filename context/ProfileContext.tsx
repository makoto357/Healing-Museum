import { createContext, useState } from "react";
//pass the whole setstate thing down
export const ThemeColorContext = createContext(null);
//createContext(default)
//username from firestore name

export const ThemeColorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeColor, setThemeColor] = useState();

  return (
    <ThemeColorContext.Provider value={[themeColor, setThemeColor]}>
      {children}
    </ThemeColorContext.Provider>
  );
};
