import { HomePage } from "~/pages/home/home";

export function meta() {
  return [
    { title: "Global Entry Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <HomePage />;
}
