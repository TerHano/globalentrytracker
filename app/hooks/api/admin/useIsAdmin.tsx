export const useIsAdmin = () => {
  const { data } = $api.useQuery("get", "/api/v1/admin/users", {
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  return {
    isAdmin: data?.success == true,
  };
};
import { $api } from "~/utils/fetchData";
