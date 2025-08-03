import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../utils/constant";
import logoblack from "../assets/logo-black.png";

const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "twitter-clone");
    data.append("cloud_name", "dqexjojgo");

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dqexjojgo/image/upload", {
        method: "POST",
        body: data,
      });
      const upload = await res.json();
      if (upload.secure_url) {
        setProfilePhoto(upload.secure_url);
        toast.success("Image uploaded");
      } else {
        toast.error("Image upload failed");
      }
    } catch (error) {
      toast.error("Cloudinary upload error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password) {
      return toast.error("All fields are required.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/register`,
        { name, username, email, password, profilePhoto },
        { withCredentials: true }
      );

      if (res.data.success) {
        const loginRes = await axios.post(
          `${USER_API_END_POINT}/login`,
          { email, password },
          { withCredentials: true }
        );

        if (loginRes.data.success) {
          localStorage.setItem("user", JSON.stringify(loginRes.data.user));
          toast.success("Account created and logged in");
          navigate("/");
        } else {
          toast.success("Account created. Please login.");
          navigate("/login");
        }
      } else {
        toast.error(res.data.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
     
      <div className="w-1/2 bg-white flex justify-center items-center">
        <img src={logoblack} alt="" className="h-64 " />
      </div>

     
      <div className="w-1/2 flex items-center justify- bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full"
        >
          <h1 className="text-6xl font-bold mb-3 text-black">Happening now.</h1>
          <p className="text-xl mb-2 font-semibold text-black">Sign up</p>

          <input
            type="text"
            placeholder="Name"
            className="border w-64  border-gray-900 p-2 rounded-3xl bg-transparent text-black transition-all duration-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            className="border w-64 text-black border-gray-900 p-2 rounded-3xl bg-transparent text-black transition-all duration-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
         <div>
  {/* Upload box */}
  <div className="flex w-64 p-1 text-black border border-gray-900 rounded-3xl items-center gap-2">
    <button
      type="button"
      onClick={() => fileInputRef.current.click()}
      className="bg-blue-500 h-9 flex-shrink-0 focus:outline-none focus:ring-0 text-white px-4 py-2 rounded-full text-sm"
    >
      Upload Photo
    </button>
    <span className="text-sm truncate text-black">{fileName}</span>
  </div>

  {/* Profile photo preview (below upload box) */}
  {profilePhoto && (
    <img
      src={profilePhoto}
      alt="profile"
      className="w-12 h-12 rounded-full object-cover mt-2"
    />
  )}
</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <input
            type="email"
            placeholder="Email"
            className="border w-64 text-black border-gray-900 p-2 rounded-3xl bg-transparent text-black transition-all duration-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border w-64 text-black mb-3 border-gray-900 p-2 rounded-3xl bg-transparent text-black transition-all duration-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 w-64 focus:outline-none focus:ring-0 text-white py-2 rounded-3xl hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          <p className="text-sm p-3 text-black">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
