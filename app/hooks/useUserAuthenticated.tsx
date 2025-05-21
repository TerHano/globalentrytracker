import React from "react";
import { AuthContext } from "~/context/auth-context";

export const useUserAuthenticated = () => {
  const isUserAuthenticated = React.useContext(AuthContext).isUserAuthenticated;
  return isUserAuthenticated;
};
