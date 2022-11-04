import { createContext, useState } from "react";
export const ThemeColorContext = createContext(null);

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
