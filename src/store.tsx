import React, { useState, ReactNode } from "react";

export interface IUser {
  username: string;
  email: string;
  token: string;
  name: string;
}
interface StoreContextType {
  user: IUser | null;
  loggedIn: (u: IUser) => void;
  loggedOut: () => void;
}

const initState = {
  user: null,
  loggedIn: () => {},
  loggedOut: () => {},
};

const StoreContext = React.createContext<StoreContextType>(initState);

interface Props {
  children?: ReactNode;
  // any props that come into the component
}

const StoreProvider = ({ children, ...props }: Props) => {
  const [user, setUser] = useState<IUser | null>(null);
  const loggedIn = (u: IUser) => {
    setUser(u);
  };
  const loggedOut = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        loggedIn,
        loggedOut,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
