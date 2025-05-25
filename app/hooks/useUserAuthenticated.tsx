import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { meQuery } from "~/api/me-api";

export const useUserAuthenticated = () => {
  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({ ...meQuery(), throwOnError: false });

  const isUserAuthenticated = useMemo(() => {
    if (isLoading) return false;
    if (isError) return false;
    if (!me) return false;
    return true;
  }, [isLoading, isError, me]);
  return { isUserAuthenticated, isLoading };
};
