"use client";
import { supabaseBrowserClient } from "./createSupbaseBrowerClient";

export async function getSupabaseToken() {
  const {
    data: { session },
    error,
  } = await supabaseBrowserClient.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session.access_token; // Return the access token
}
