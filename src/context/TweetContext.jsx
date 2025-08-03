import React, { createContext, useContext, useState } from "react";

export const TweetContext = createContext();

export const TweetProvider = ({ children }) => {
  const [tweets, setTweets] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [isActive, setIsActive] = useState(true); // true = "For You", false = "Following"

  const updateTweetInContext = (updatedTweet) => {
    setTweets((prevTweets) =>
      prevTweets.map((tweet) =>
        tweet._id === updatedTweet._id ? updatedTweet : tweet
      )
    );
  };

  const toggleRefresh = () => setRefresh((prev) => !prev);

  return (
    <TweetContext.Provider
      value={{
        tweets,
        setTweets,
        updateTweetInContext,
        refresh,
        toggleRefresh,
        isActive,
        setIsActive,
      }}
    >
      {children}
    </TweetContext.Provider>
  );
};


export const useTweetContext = () => useContext(TweetContext);
