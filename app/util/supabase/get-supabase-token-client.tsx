"use client";
import { createSupabaseBrowserClient } from "./createSupbaseBrowerClient";

const supabase = createSupabaseBrowserClient();

export async function getSupabaseToken() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) {
    console.error("Error retrieving session:", error);
    return null;
  }

  return session.access_token; // Return the access token
}
