import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CaseCreate = lazy(() => import("./pages/CaseCreate"));
const CaseEntry = lazy(() => import("./pages/CaseEntry"));
const CaseRoom = lazy(() => import("./pages/CaseRoom"));
const ExportOrder = lazy(() => import("./pages/ExportOrder"));
const JoinCase = lazy(() => import("./pages/JoinCase"));
const Profile = lazy(() => import("./pages/Profile"));
const Landing = lazy(() => import("./pages/Landing"));

// Lazy-loaded components
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AppLayout = lazy(() => import("./components/layout/AppLayout"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading...</div>}>

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Wrapper */}
          <Route element={<ProtectedRoute />}>
            {/* Layout Wrapper (Navbar + Outlet) */}
            <Route element={<AppLayout />}>
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-case" element={<CaseCreate />} />
              <Route path="/case/join" element={<JoinCase />} />
              <Route path="/case/:caseId" element={<CaseEntry />} />
              <Route path="/case/:caseId/room" element={<CaseRoom />} />
              <Route path="/case/:caseId/export" element={<ExportOrder />} />
              <Route path="/profile" element={<Profile />} />

            </Route>
          </Route>
        </Routes>

      </Suspense>
    </BrowserRouter>
  );
}

export default App;
