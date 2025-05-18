import { SubscriptionSuccessfulPage } from "~/pages/subscription-successful/subscription-successful";

export function meta() {
  return [
    { title: "Global Entry Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <SubscriptionSuccessfulPage />;
}
