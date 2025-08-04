import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../utils/constant";
import logoblack from "../assets/logo-black.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An error occurred while logging in"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col md:flex-row overflow-hidden">
      {/* Logo - Top on mobile, left on desktop */}
      <div className="w-full md:w-1/2 bg-white flex justify-center items-center p-6">
        <img src={logoblack} alt="Logo" className="h-40 md:h-64" />
      </div>

      {/* Form - Bottom on mobile, right on desktop */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-sm"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-3 text-black">
            Happening now.
          </h1>
          <h2 className="text-xl md:text-2xl mb-2 font-semibold text-black">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="border w-full text-black border-gray-900 p-2 rounded-3xl bg-transparent transition-all duration-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border w-full text-black border-gray-900 p-2 mb-4 rounded-3xl bg-transparent transition-all duration-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 w-full focus:outline-none focus:ring-0 text-white p-2 rounded-3xl hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-gray-700 p-3 text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
