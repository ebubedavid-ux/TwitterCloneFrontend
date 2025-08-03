import axios from "axios";
import React, { useState, useEffect, useRef, useContext } from "react";
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import toast from "react-hot-toast";
import { TWEET_API_END_POINT, USER_API_END_POINT } from "../utils/constant";
import { UserContext } from "../context/UserContext";
import { TweetContext } from "../context/TweetContext";

const CreatePost = () => {
  const { user } = useContext(UserContext);
  const { setTweets, isActive } = useContext(TweetContext);

  const [description, setDescription] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [tweetImage, setTweetImage] = useState("");
  const [fileName, setFileName] = useState("No file chosen");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const fileInputRef = useRef(null);
  



  useEffect(() => {
    if (!user?._id) return;
    setIsLoadingProfile(true);
    axios
      .get(`${USER_API_END_POINT}/profile/${user._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.user?.profilePhoto) {
          setProfilePhoto(res.data.user.profilePhoto);
        }
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        toast.error("Failed to load profile photo.");
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [user?._id]);

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
      const uploadImageUrl = await res.json();
      if (uploadImageUrl.secure_url) {
        setTweetImage(uploadImageUrl.secure_url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("Failed to upload image.");
      }
      console.log("Cloudinary secure_url:", uploadImageUrl.secure_url);

    } catch (error) {
      toast.error("Failed to upload image.");
      setFileName("No file chosen");
      setTweetImage("");
    }
  };

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

  const submitHandler = async () => {
    if (!description.trim() && !tweetImage) {
      toast.error("Please add a description or image to post.");
      return;
    }

    setIsSubmitting(true);
    try {

      console.log("Sending to backend:", {
        description,
        image: tweetImage,
        id: user?._id,
      });

      const res = await axios.post(
        `${TWEET_API_END_POINT}/create`,
        { description, image: tweetImage, id: user?._id },
        { withCredentials: true }
      );

      console.log("Tweet created:", res.data.tweet);
      console.log("Submitting with image:", tweetImage);


      if (res.data.success) {
        toast.success(res.data.message);
        setDescription("");
        setTweetImage("");
        setFileName("No file chosen");
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchTweets();
      } else {
        throw new Error(res.data.message || "Failed to create tweet.");
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create tweet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
    

      <div className="flex items-start p-4">
        <div className="flex-shrink-0">
          {isLoadingProfile ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : (
            <Avatar
              src={profilePhoto || "./default-avatar.png"}
              size="40"
              round={true}
              onError={() => setProfilePhoto("./default-avatar.png")}
            />
          )}
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-transparent outline-none p-2 text-lg ml-2 resize-none"
          rows="3"
          placeholder="What is happening?!"
        />
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2 mb-2">
          <label
            htmlFor="tweetImage"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 cursor-pointer"
          >
            <CiImageOn
              size="38px"
              className="p-2 hover:bg-gray-200 rounded-full"
            />
            <span>{fileName}</span>
          </label>
          <input
            id="tweetImage"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />
          {tweetImage && (
            <button
              onClick={() => {
                setTweetImage("");
                setFileName("No file chosen");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          )}
        </div>
        {tweetImage && (
          <div className="mb-2">
            <img
              src={tweetImage}
              alt="Tweet Preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-end p-4 border-b border-gray-300">
        <button
          onClick={submitHandler}
          disabled={isSubmitting || (!description.trim() && !tweetImage)}
          className={`bg-[#1D9BF0] px-4 text-lg text-white py-1 border-none rounded-full ${
            isSubmitting || (!description.trim() && !tweetImage)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          } transition flex items-center gap-2`}
        >
          {isSubmitting && (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v2m0 12v2m-8-8H2m18 0h2M5.64 5.64l1.42 1.42m10.36 10.36l1.42 1.42M5.64 18.36l1.42-1.42m10.36-10.36l1.42-1.42"
              />
            </svg>
          )}
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
