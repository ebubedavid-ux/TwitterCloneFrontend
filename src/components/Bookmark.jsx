// pages/BookmarkPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Tweet from "../components/Tweet";
import { TWEET_API_END_POINT } from "../utils/constant";
import { UserContext } from "../context/UserContext"; // if you have global user

const BookmarkPage = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);  

  useEffect(() => {
    const fetchBookmarkedTweets = async () => {
      try {
        const res = await axios.get(`${TWEET_API_END_POINT}/bookmarks`, {
          withCredentials: true,
        });
        setBookmarkedTweets(res.data.tweets);
      } catch (error) {
        console.error("Failed to fetch bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedTweets();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading bookmarks...</p>;

  if (bookmarkedTweets.length === 0)
    return <p className="text-center mt-10">You have no bookmarks yet.</p>;

  return (
     <div className="w-full max-w-[600px] mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-4 px-4">Bookmarked Tweets</h1>
      {bookmarkedTweets.map((tweet) => (
        <Tweet
          key={tweet._id}
          tweet={tweet}
          user={user}
          setTweets={setBookmarkedTweets}
          isActive={false}
          disableAutoFetch={true}
        />
      ))}
    </div>
  );
};

export default BookmarkPage;
