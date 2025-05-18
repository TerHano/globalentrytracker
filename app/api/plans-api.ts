import { queryOptions } from "@tanstack/react-query";
import type { PlanFrequency } from "~/enum/PlanFrequency";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const planQueryKey = "plan";

export interface plan {
  id: number;
  name: string;
  description: string;
  priceId: string;
  price: number;
  discountedPrice: number;
  features: string[];
  frequency: PlanFrequency;
}

export async function planApi(token: string) {
  return fetchData<plan[]>("/api/v1/plans", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const planQuery = (token?: string) =>
  queryOptions({
    queryKey: [planQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return planApi(token);
    },
  });
