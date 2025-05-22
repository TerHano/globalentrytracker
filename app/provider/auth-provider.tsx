import { useEffect, useState, type PropsWithChildren } from "react";
import { AuthContext } from "~/context/auth-context";
import { supabaseBrowserClient } from "~/utils/supabase/createSupbaseBrowerClient";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log("being created");

    const sub = supabaseBrowserClient.auth.onAuthStateChange((_, session) => {
      console.log("useUserAuthenticated", session, _);
      if (session) {
        setIsUserAuthenticated(true);
      } else {
        setIsUserAuthenticated(false);
      }
    });

    // Check initial session
    supabaseBrowserClient.auth.getSession().then(({ data: { session } }) => {
      setIsUserAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      sub.data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isUserAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
