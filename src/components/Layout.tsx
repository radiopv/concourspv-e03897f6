import { Outlet } from "react-router-dom";
import UserNavBar from "./navigation/UserNavBar";
import MobileNavBar from "./navigation/MobileNavBar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavBar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <MobileNavBar />
    </div>
  );
};

export default Layout;