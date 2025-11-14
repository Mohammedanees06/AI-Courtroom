import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import api from "../utils/apiClient"; 

export default function Login() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Please enter email and password");

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });

      // Store token & user data in Redux and localStorage
      dispatch(
        loginSuccess({
          token: res.data.token,
          user: res.data.user,
        }),
      );

      window.location.href = "/dashboard"; // Redirect after login
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      dispatch(
        loginSuccess({
          token: res.data.token,
          user: res.data.user,
        }),
      );

      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-md p-6 w-80 rounded">
        <h2 className="text-xl font-bold mb-4 text-center">Login ⚖️</h2>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Google Login Failed")} />
        </div>

        <p className="text-sm text-center mt-3">
          No account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
