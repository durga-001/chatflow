import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";

/**
 * Application route configuration.
 *
 * Route map:
 *   /           → redirect to /chat
 *   /login      → Login page (public)
 *   /signup     → Signup page (public)
 *   /chat       → Chat page (protected, requires auth)
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/chat" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    // Protected routes wrapped in MainLayout
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
    ],
  },
  {
    // 404 fallback
    path: "*",
    element: <Navigate to="/chat" replace />,
  },
]);

export default router;
