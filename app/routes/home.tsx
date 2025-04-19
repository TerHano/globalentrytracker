import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "Global Entry Tracker" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
