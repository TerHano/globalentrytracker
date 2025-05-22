import React from "react";

export type AuthContextType = {
  isUserAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  isUserAuthenticated: false,
  isLoading: true,
});
