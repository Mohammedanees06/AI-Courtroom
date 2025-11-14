import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { loginSuccess } from "../features/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import api from "../utils/apiClient"; // Use centralized axios client

export default function Register() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Auto-login after successful registration
      dispatch(loginSuccess(res.data.token));
      window.location.href = "/dashboard";
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  // Handle Google OAuth registration/login
  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });

      dispatch(loginSuccess(res.data.token));
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Google Sign-in Failed", error.response?.data?.message || "");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white shadow-md p-6 w-80 rounded">
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="bg-green-600 text-white p-2 rounded w-full" type="submit">
          Register
        </button>

        <div className="mt-4 flex justify-center">
          <GoogleLogin onSuccess={handleGoogleRegister} onError={() => alert("Google Sign-in Failed")} />
        </div>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
