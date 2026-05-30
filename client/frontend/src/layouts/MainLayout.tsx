import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * Layout for authenticated pages.
 * Renders a mobile Navbar on top, then the page content via <Outlet />.
 * The Chat page manages its own sidebar layout internally.
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
