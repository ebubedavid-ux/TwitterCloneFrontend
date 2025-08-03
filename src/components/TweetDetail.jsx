import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { CiHeart, CiBookmark } from "react-icons/ci";
import { VscComment } from "react-icons/vsc";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import CommentSection from "./CommentSection";


const TweetDetail = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
    const [commentCount, setCommentCount] = useState(0);

  const fetchTweet = async () => {
    try {
      const res = await axios.get(`${TWEET_API_END_POINT}/tweet/${id}`, {
        withCredentials: true,
      });
      setTweet(res.data.tweet);
    } catch (error) {
      toast.error("Failed to load tweet.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCommentCount = async () => {
  try {
    const res = await axios.get(
      `${TWEET_API_END_POINT}/comments/count/${id}`,
      { withCredentials: true }
    );
    setCommentCount(res.data.count);
  } catch (error) {
    console.error("Failed to fetch comment count");
  }
};


  useEffect(() => {
    fetchTweet();
    fetchCommentCount();
  }, [id]);

   const likeOrDislikeHandler = async (id) => {
      try {
        await axios.put(
          `${TWEET_API_END_POINT}/likeordislike/${id}`,
          { id: user?._id },
          { withCredentials: true }
        );
        fetchTweet();
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to like/dislike tweet."
        );
      }
    };
  
     const bookmarkHandler = async (id) => {
    try {
      await axios.put(
        `${TWEET_API_END_POINT}/bookmark/${id}`,
        {},
        {withCredentials: true}
      );
      fetchTweet();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to bookmark tweet."
      );
    }
  }
  
    const deleteTweetHandler = async (id) => {
      try {
        await axios.delete(`${TWEET_API_END_POINT}/delete/${id}`, {
          withCredentials: true,
        });
        fetchTweet();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete tweet.");
      }
    };

  if (loading) return <div className="p-4">Loading tweet...</div>;

  if (!tweet) return <div className="p-4">Tweet not found.</div>;

  return (
    <div className="border-b border-b-gray-200">
      <div className="flex p-4">
        <Avatar
          src={
            tweet?.userId?.profilePhoto ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          size="40"
          round={true}
        />
        <div className="ml-2 w-full">
          <div className="flex items-center">
            <h1 className="font-bold text-xl">
              {tweet?.userId?.name || "Unknown User"}
            </h1>
            <p className="text-gray-500 text-sm ml-1">
              @{tweet?.userId?.username || "unknown"}
            </p>
          </div>
          <div className="text-bold">
            
            <p>{tweet?.description || "No description available."}</p>
            
          </div>
          {tweet?.image && !imageError && (
            <div className="my-3">
              <img
                src={tweet.image}
                alt="Tweet"
                className="w-full rounded-lg object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          {imageError && tweet?.image && (
            <p className="text-red-500 text-sm my-3">Failed to load image.</p>
          )}
          <div className="flex justify-between my-3">
            <div className="flex items-center">
              <div className="p-2 hover:cursor-pointer hover:bg-green-100 rounded-full">
                <VscComment size={"21px"} />
              </div>
             <p>{commentCount}</p>
            </div>
            <div className="flex items-center">
              <div
                onClick={() => likeOrDislikeHandler(tweet?._id)}
                className="p-2 hover:cursor-pointer hover:bg-pink-200 rounded-full"
              >
                <CiHeart size={"27px"} />
              </div>
              <p>{tweet?.like?.length || 0}</p>
            </div>
            <div className="flex items-center">
              <div 
                onClick={() => bookmarkHandler(tweet?._id)}
              className="p-2 hover:cursor-pointer hover:bg-yellow-100 rounded-full">
                <CiBookmark size={"24px"} />
              </div>
              <p>{tweet?.bookmarks?.length || 0}</p>
            </div>
            {user?._id === tweet?.userId._id && (
              <div
                onClick={() => deleteTweetHandler(tweet?._id)}
                className="flex items-center"
              >
                <div className="p-2 hover:cursor-pointer hover:bg-red-500 rounded-full">
                  <MdOutlineDeleteOutline size={"24px"} />
                </div>
                
              </div>
            )}
          </div>
        </div>
      </div>

   
<CommentSection tweetId={tweet._id} onCommentAdded={fetchCommentCount} />


    </div>
  );
};

export default TweetDetail;
