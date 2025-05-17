import { queryOptions } from "@tanstack/react-query";
import { fetchData } from "~/utils/fetchData";
import { getSupabaseToken } from "~/utils/supabase/get-supabase-token-client";

export const subscriptionInformationQueryKey = "subscription-information";

export interface subscriptionInformation {
  active: boolean;
  planName: string;
  planPrice: number;
  currency: string;
  planInterval: string;
  isEnding: boolean;
  nextPaymentDate: Date;
  cardLast4Digits: string;
  cardBrand: string;
}

export async function subscriptionInformationApi(token: string) {
  return fetchData<subscriptionInformation>("/api/v1/subscription", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export const subscriptionInformationQuery = (token?: string) =>
  queryOptions({
    queryKey: [subscriptionInformationQueryKey],
    queryFn: async () => {
      if (!token) {
        const _token = await getSupabaseToken();
        if (!_token) {
          throw new Error("No token found");
        }
        token = _token;
      }
      return subscriptionInformationApi(token);
    },
  });
