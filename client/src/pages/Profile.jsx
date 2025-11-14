import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Card, Button, Avatar } from "flowbite-react";

const InfoCard = ({ icon, label, value }) => (
  <Card className="bg-white/5 backdrop-blur border border-gray-700 hover:border-yellow-400/50">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <h3 className="text-sm font-semibold text-gray-400 uppercase">{label}</h3>
    </div>
    <p className="text-white font-medium break-all text-sm">{value}</p>
  </Card>
);

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden flex items-center justify-center p-4">
      {user ? (
        <Card className="bg-white/10 backdrop-blur-lg border border-gray-700 shadow-2xl w-full max-w-5xl">
          <div className="bg-linear-to-r from-yellow-400 to-yellow-600 h-32 -m-6 mb-12 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <Avatar size="xl" className="w-32 h-32 border-4 border-gray-900 bg-linear-to-br from-yellow-400 to-yellow-600">
                <span className="text-5xl">👤</span>
              </Avatar>
            </div>
          </div>

          <div className="text-center pt-4">
            <h1 className="text-3xl font-bold text-white mb-2">{user.name || "User"}</h1>
            <p className="text-gray-400 mb-8 break-word">{user.email}</p>

            <div className="grid md:grid-cols-2 gap-6 mb-8 text-left">
              <InfoCard icon="📧" label="Email" value={user.email} />
              <InfoCard icon="🎭" label="Role" value={user.role || "User"} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/dashboard")} outline className="border-gray-600 text-white hover:bg-white/10">
                ← Back to Dashboard
              </Button>
              <Button onClick={handleLogout} className="bg-linear-to-r from-red-600 to-red-700">
                🚪 Logout
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-white/10 backdrop-blur-lg border border-gray-700 p-12 text-center max-w-2xl">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-300 text-lg mb-6">No profile data found. Please log in again.</p>
          <Button onClick={() => navigate("/login")} className="bg-linear-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold">
            Go to Login
          </Button>
        </Card>
      )}
    </div>
  );
}
