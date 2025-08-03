import React, { useState, useEffect, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT, TWEET_API_END_POINT } from "../utils/constant";
import { UserContext } from "../context/UserContext";
import { TweetContext } from "../context/TweetContext";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";



const Home = () => {
  const { user, setUser, otherUsers, setOtherUsers } = useContext(UserContext);
  const { setTweets, isActive } = useContext(TweetContext);

 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserStr = localStorage.getItem("user");
    if (!storedUserStr) {
      navigate("/login");
      return;
    }
    try {
      const storedUser = JSON.parse(storedUserStr);
      setUser(storedUser);
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate, setUser]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchUsersAndTweets = async () => {
      try {
        const [usersRes, tweetsRes] = await Promise.all([
          axios.get(`${USER_API_END_POINT}/otherusers/${user._id}`, {
            withCredentials: true,
          }),
          axios.get(
            isActive
              ? `${TWEET_API_END_POINT}/alltweet/${user._id}`
              : `${TWEET_API_END_POINT}/followingtweet/${user._id}`,
            { withCredentials: true }
          ),
        ]);

        setOtherUsers(usersRes.data.otherUsers || []);
        setTweets(tweetsRes.data.tweets || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsersAndTweets();
  }, [user, isActive, setOtherUsers, setTweets]);

return (
  <div className="flex w-full max-w-[1440px] mx-auto relative text-black min-h-screen">
    {/* Left Sidebar (fixed width) */}
    <div className="hidden md:block w-[240px]">
      <LeftSideBar />
    </div>

    {/* Main Content - takes remaining space */}
    <div className="flex-1 px-2 md:px-4">
      <Outlet />
    </div>

    {/* Right Sidebar (fixed width) */}
    <div className="hidden lg:flex w-[300px] min-h-screen border-l border-gray-200">
      <RightSideBar />
    </div>

    {/* Mobile bottom nav */}
    <div className="md:hidden fixed bottom-0 left-0 w-full z-50">
      <LeftSideBar mobile />
    </div>
  </div>
);




};

export default Home;
