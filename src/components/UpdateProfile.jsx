// FILE: src/components/UpdateProfile.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
          withCredentials: true,
        });
        const user = res.data.user;
        setName(user.name || "");
        setUsername(user.username || "");
        setBio(user.bio || "");
      } catch (error) {
        toast.error("Failed to load user profile");
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/profile/update/${id}`,
        { name, username, bio },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Profile updated successfully");
        localStorage.setItem("user", JSON.stringify(res.data.user));

        navigate(`/profile/${id}`);
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occurred during update"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen  flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded w-96 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-center text-black-500">
          Update Profile
        </h2>
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 rounded bg-transparent"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-2 rounded bg-transparent"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          placeholder="Bio"
          className="border border-gray-300 p-2 rounded bg-transparent"
          rows="4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
