import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { meQuery } from "~/api/me-api";
// import { paths } from "~/types/api";

// type MeError =
//   paths["/api/v1/me"]["get"]["responses"]["401"]["content"]["application/json"];

export const useUserAuthenticated = () => {
  const {
    data: me,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    ...meQuery(),
    throwOnError: false,
    retry: () => {
      // Don't retry auth failures (401/403)
      return false;
      // if (error?.status === 401 || error?.status === 403) {
      //   return false;
      // }
      // return failureCount < 3;
    },
    // Add staleTime to prevent immediate refetch on hydration
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Use initialData from cache to prevent hydration mismatch
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const isUserAuthenticated = useMemo(() => {
    // During hydration, trust the cache data if available
    if (isLoading && !me) return false;
    if (isError) return false;
    if (!me) return false;
    return true;
  }, [isLoading, isError, me]);
  
  return { 
    isUserAuthenticated, 
    // Return loading state that accounts for fetching
    isLoading: isLoading || isFetching 
  };
};
