import React, { useContext, useState, useEffect } from "react";
import CreatePost from "./CreatePost";
import { Plus } from "lucide-react";
import Tweet from "./Tweet";
import { UserContext } from "../context/UserContext";
import { TweetContext } from "../context/TweetContext";
import { useNavigate } from "react-router-dom";
import logoblack from "../assets/logo-black.png";

const Feed = () => {
  const { user } = useContext(UserContext);
  const { tweets, setTweets, isActive, setIsActive } = useContext(TweetContext);
  const navigate = useNavigate();

   const fetchTweets = async () => {
      try {
        const res = await axios.get(
          isActive
            ? `${TWEET_API_END_POINT}/alltweet/${user._id}`
            : `${TWEET_API_END_POINT}/followingtweet/${user._id}`,
          { withCredentials: true }
        );
        setTweets(res.data.tweets);
        
      } catch (error) {
        console.log(error);
      }
    };

     useEffect(() => {
        fetchTweets();
       
      }, []);

 return (
  <div className="w-full max-w-[600px] mx-auto px-4">

    {/* Container for sticky logo and tabs */}
    <div className="relative">

      {/* X Logo - sticky on top */}
      <div className="block md:hidden sticky top-0 bg-white z-50  flex justify-center items-center py-4">

       {user?.profilePhoto && (
    <img
      src={user.profilePhoto}
      alt="Profile"
      className="w-7 h-7 items-top rounded-full object-cover absolute left-1 top-1/2 -translate-y-1/2 cursor-pointer"
      onClick={() => navigate(`/profile/${user?._id}`)}
    />
  )}

        <img src={logoblack} alt="X Logo" className="h-6 w-auto" />
        
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300 flex justify-between text-sm font-semibold text-gray-500">
        <div
          onClick={() => setIsActive(true)}
          className={`w-1/2 text-center py-3 cursor-pointer ${
            isActive ? "text-black border-b-2 border-blue-500" : ""
          }`}
        >
          For You
        </div>
        <div
          onClick={() => setIsActive(false)}
          className={`w-1/2 text-center py-3 cursor-pointer ${
            !isActive ? "text-black border-b-2 border-blue-500" : ""
          }`}
        >
          Following
        </div>
      </div>

    </div>

    {/* Create Post Button */}
    <button
      onClick={() => navigate("/create-post")}
      className="fixed bottom-12 right-4 md:right-[calc(25%_+_1.5rem)] w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all z-50"
     
      title="Create Post"
    >
      <Plus size={28} />
    </button>

    {/* Tweets */}
    {tweets?.map((tweet) => (
      <Tweet
        key={tweet?._id}
        tweet={tweet}
        user={user}
        setTweets={setTweets}
        isActive={isActive}
         disableAutoFetch={false} 
      />
    ))}

  </div>
);


};

export default Feed;
