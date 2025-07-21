import React, { createContext, useState, ReactNode, useEffect } from "react";
import { ConfigProvider } from "antd";
import { getLocalStoragedata, setLocalStorageData } from "../../helpers/Storage";

// Define the shape of the AuthContext
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Create the context with a default value (will be overridden by the provider)
export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
});

// Define the props for the provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromURL = urlParams.get("token");
  const storedToken = getLocalStoragedata("token");

  const initialToken = tokenFromURL || storedToken;
  const [token, setToken] = useState<string | null>(initialToken);

  useEffect(() => {
    if (tokenFromURL) {
      setLocalStorageData("token", tokenFromURL);
      const cleanURL = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanURL);
    }
  }, [tokenFromURL]);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <ConfigProvider
        theme={{
          components: {
            Notification: {
              paddingMD: 15,
              colorIcon: "rgb(255, 255, 255)",
              colorTextHeading: "rgba(254, 254, 254, 0.88)",
              colorIconHover: "rgb(255, 255, 255)",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AuthContext.Provider>
  );
}

