import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import toast from "react-hot-toast";
import { USER_API_END_POINT, TWEET_API_END_POINT } from "../utils/constant";
import { UserContext } from "../context/UserContext";
import Tweet from "./Tweet";

const Profile = () => {
  const { user } = useContext(UserContext);
  const [profileData, setProfileData] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
        withCredentials: true,
      });
      setProfileData(res.data.user);
      console.log("Fetched Profile:", res.data.user);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTweets = async () => {
    try {
      const res = await axios.get(`${TWEET_API_END_POINT}/getowntweet/${id}`, {
        withCredentials: true,
      });
      setTweets(res.data.tweets);
    } catch (error) {
      console.error("Error fetching user tweets:", error);
      toast.error("Failed to load tweets.");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    fetchProfile();
    fetchUserTweets();
  }, [id]);

  const followAndUnfollowHandler = async () => {
    try {
      let res;
      const isFollowing = profileData.followers.includes(loggedInUser._id);

      if (isFollowing) {
        res = await axios.post(
          `${USER_API_END_POINT}/unfollow/${id}`,
          { id: loggedInUser._id },
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          `${USER_API_END_POINT}/follow/${id}`,
          { id: loggedInUser._id },
          { withCredentials: true }
        );
      }

      setProfileData({ ...res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-6">Loading profile...</div>;
  }

  if (!profileData) {
    return <div className="p-6">Profile not found</div>;
  }

  const isOwner = loggedInUser?._id === profileData?._id;

  return (
     <div className="w-full max-w-[600px] mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <Avatar
          src={
            profileData.profilePhoto ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          size="80"
          round={true}
        />
        <div>
          <h1 className="text-xl font-bold">{profileData.name}</h1>
          <p className="text-gray-500">@{profileData.username}</p>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-4">
        <p>{profileData.bio || "No bio available."}</p>
      </div>

      {/* Follow / Edit Profile Button */}
      {isOwner ? (
        <div className="mt-6">
          <button
            onClick={() => navigate(`/profile/update/${id}`)}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-3xl"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <button
          onClick={followAndUnfollowHandler}
          className="px-4 py-1 bg-black text-white rounded-full border border-gray-400 mt-6"
        >
          {profileData.followers.includes(loggedInUser?._id) ? "Following" : "Follow"}
        </button>
      )}

      {/* Tweets Section */}
      <div className="mt-8 ">
        <h2 className="text-xl font-semibold mb-4">Tweets</h2>
        {tweets.length === 0 ? (
          <p>No tweets to display.</p>
        ) : (
          tweets.map((tweet) => <Tweet key={tweet._id} tweet={tweet} />)
        )}
      </div>
    </div>
  );
};

export default Profile;

