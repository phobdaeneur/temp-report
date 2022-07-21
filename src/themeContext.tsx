import { createContext, ReactNode, useState, useEffect } from "react";

interface ITheme {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
}

const initState: ITheme = {
  theme: "light",
  setTheme: () => null,
};

const ThemeContext = createContext<ITheme>(initState);

interface Props {
  children: ReactNode;
  initialTheme: string;
}

function getInitialTheme(): string {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedPrefs = window.localStorage.getItem("color-theme");
    if (typeof storedPrefs === "string") {
      return storedPrefs;
    }

    const userMedia = window.matchMedia("(prefers-color-scheme: dark)");
    if (userMedia.matches) {
      return "dark";
    }
  }
  return "dark";
}

// const initialTheme = getInitialTheme();

const ThemeProvider = ({ initialTheme, children }: Props) => {
  const [theme, setTheme] = useState<string>(getInitialTheme);

  //   const toggleTheme = () => {
  //     setTheme(theme === "dark" ? "light" : "dark");
  //     window.localStorage.setItem(
  //       "color-theme",
  //       theme === "dark" ? "light" : "dark"
  //     );
  //   };

  const rawSetTheme = (rawTheme: string) => {
    const root = window.document.documentElement;
    const isDark = rawTheme === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(rawTheme);

    localStorage.setItem("color-theme", rawTheme);
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  useEffect(() => {
    rawSetTheme(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider, ThemeContext };
