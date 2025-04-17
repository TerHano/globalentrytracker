import { Outlet } from "react-router";

export const HeaderLayout = () => {
  return (
    <div className="max-w-xl mx-auto">
      <Outlet />
    </div>
  );
};
