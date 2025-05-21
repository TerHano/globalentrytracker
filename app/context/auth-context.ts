import React from "react";

export type AuthContextType = {
  isUserAuthenticated: boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  isUserAuthenticated: false,
});
