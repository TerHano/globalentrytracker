import { queryOptions } from "@tanstack/react-query";
import { fetchClient, validateResponse } from "~/utils/fetchData";

export const planQuery = () =>
  queryOptions({
    queryKey: [planQuery.name],
    queryFn: async () => {
      return fetchClient
        .GET("/api/v1/plans")
        .then((response) => validateResponse(response.data));
    },
  });
