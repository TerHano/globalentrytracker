"use client";
import { supabaseBrowserClient } from "./createSupbaseBrowerClient";

export async function getSupabaseToken() {
  const {
    data: { session },
    error,
  } = await supabaseBrowserClient.auth.getSession();
  if (error || !session) {
    return undefined;
  }

  return session.access_token; // Return the access token
}
