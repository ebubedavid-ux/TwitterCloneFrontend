// FILE: src/components/RightSideBar.jsx
import React, { useContext } from "react";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import SearchBar from "../components/SearchBar";

const RightSideBar = () => {
  const navigate = useNavigate();
  const { otherUsers } = useContext(UserContext);

  return (
    <div className=" p-4 border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
       <div className="mb-2"><SearchBar /></div>
      <div className="w-full bg-gray-100 pt-2 rounded-xl">
      <h2 className="text-lg font-bold mb-1 ml-4 ">Who to follow</h2>
      {otherUsers?.length > 0 ? (
        otherUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => navigate(`/profile/${user._id}`)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
          >
            <Avatar
              src={
                user.profilePhoto ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              size="35"
              round={true}
            />
            <div>
              <h3 className="font-semibold text-sm">{user.name}</h3>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No users available.</p>
      )}
        </div>

    </div>
  );
};

export default RightSideBar;
