import { Outlet, useNavigation } from "react-router";

export default function DefaultLayout() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  return (
    <div className="container">
      <Outlet />
    </div>
  );
}
