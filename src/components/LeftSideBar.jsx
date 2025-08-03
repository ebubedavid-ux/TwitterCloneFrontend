// FILE: src/components/LeftSideBar.jsx
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { IoHomeOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { FiLogOut } from "react-icons/fi";
import { UserContext } from "../context/UserContext";
import logoblack from "../assets/logo-black.png";
import { CiSearch } from "react-icons/ci";

const LeftSideBar = ({ mobile = false }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const logoutHandler = async () => {
    try {
      await fetch(`${USER_API_END_POINT}/logout`, {
        credentials: "include",
      });
      localStorage.removeItem("user");
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // 👇 MOBILE ICONS-ONLY VIEW
  if (mobile) {
    return (
      <div className="w-full bg-white border-t border-gray-200 flex justify-around items-center py-2">
        <IoHomeOutline
          size={24}
          onClick={() => navigate("/")}
          className="text-gray-700 cursor-pointer"
        />
        <CiSearch
          size={24}
          onClick={() => navigate("/search")}
          className="text-gray-700"
        />
        <CiBookmark
          size={24}
          onClick={() => navigate("/bookmark")}
          className="text-gray-700 cursor-pointer"
        />
        <FiLogOut
          size={24}
          onClick={logoutHandler}
          className="text-red-500 cursor-pointer"
        />
      </div>
    );
  }

 // 👇 DESKTOP FULL VIEW
return (
  <div className="w-full p-6 pr-3 border-r border-gray-300 h-screen sticky top-0 flex flex-col items-end">
    {/* Logo aligned right */}
    <div className="mb-10 mr-2 w-full flex justify-end">
      <img src={logoblack} alt="" className="h-16" />
    </div>

    {/* Navigation aligned right */}
    <div className="flex flex-col gap-2 items-end w-full">
      <div
        onClick={() => navigate("/")}
        className=" flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg justify-end text-right w-30"
      >
        <IoHomeOutline size={22} />
        <span className="text-lg font-bold">Home</span>
      </div>
      <div
        onClick={() => navigate(`/profile/${user?._id}`)}
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg justify-end text-right w-30"
      >
        {user?.profilePhoto ? (
    <img
      src={user.profilePhoto}
      alt="Profile"
      className="w-6 h-6 rounded-full object-cover"
    />
  ) : (
    <CgProfile size={22} />
  )}
  <span className="text-lg font-bold">Profile</span>

      </div>
      <div
        onClick={() => navigate("/bookmark")}
        className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg justify-end text-right w-30"
      >
        <CiBookmark size={22} />
        <span className="text-lg font-bold">Bookmarks</span>
      </div>
      <div
        onClick={logoutHandler}
        className="flex items-center gap-3 cursor-pointer hover:bg-red-100 text-red-500 p-2 rounded-lg justify-end text-right w-30"
      >
        <FiLogOut size={22} />
        <span className="text-lg font-bold">Logout</span>
      </div>
    </div>
  </div>
);


};


export default LeftSideBar;
