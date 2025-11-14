import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // If not authenticated → redirect to landing/login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Authenticated → allow nested routes inside this protection
  return <Outlet />;
  // return children;
}
