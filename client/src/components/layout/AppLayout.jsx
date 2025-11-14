import { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";

const Navbar = lazy(() => import("./Navbar"));

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Suspense fallback={<div className="p-3">Loading Navbar...</div>}>
        <Navbar />
      </Suspense>

      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
