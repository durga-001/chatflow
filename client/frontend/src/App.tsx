import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import router from "./routes";

/**
 * Root application component.
 * Wraps the entire app in AuthProvider so all routes have access to auth state,
 * then hands control to the router.
 */
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
