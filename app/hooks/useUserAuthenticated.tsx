import React from "react";
import { AuthContext } from "~/context/auth-context";

export const useUserAuthenticated = () => {
  const { isUserAuthenticated, isLoading } = React.useContext(AuthContext);
  return { isUserAuthenticated, isLoading };
};
