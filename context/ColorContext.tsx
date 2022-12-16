import React, { createContext, useState } from "react";
export const ThemeColorContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

export type ThemeContextType = {
  themeColor: { primary: string; secondary: string };
  setThemeColor: React.Dispatch<
    React.SetStateAction<{ primary: string; secondary: string }>
  >;
};

export const ThemeColorContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [themeColor, setThemeColor] = useState<{
    primary: string;
    secondary: string;
  }>({ primary: "#eeece5", secondary: "#eeece5" });

  return (
    <ThemeColorContext.Provider value={{ themeColor, setThemeColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
};
