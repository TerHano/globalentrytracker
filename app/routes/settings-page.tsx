import { redirect } from "react-router";

export async function loader() {
  return redirect("/settings/profile");
}
export default function SettingsPage() {
  return null;
}
