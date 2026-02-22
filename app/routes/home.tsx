import { HomePage } from "~/pages/home/home";

export function meta() {
  return [
    { title: "Global Entry Tracker" },
    {
      name: "description",
      content:
        "Track Global Entry interview openings and get notified as soon as slots become available.",
    },
  ];
}

export default function Home() {
  return <HomePage />;
}
