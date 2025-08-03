import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Avatar from "react-avatar";
import { UserContext } from "../context/UserContext";
import { TWEET_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";

const CommentSection = ({ tweetId, onCommentAdded }) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${TWEET_API_END_POINT}/comments/${tweetId}`, {
        withCredentials: true,
      });
      setComments(res.data.comments);
    } catch (error) {
      toast.error("Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return toast.error("Comment cannot be empty");

    try {
      await axios.post(`${TWEET_API_END_POINT}/comments`, {
        tweetId,
        userId: user._id,
        text: newComment,
      }, { withCredentials: true });

      setNewComment("");
      fetchComments();

       if (onCommentAdded) {
      onCommentAdded(); 
    }
  
    } catch (error) {
      toast.error("Failed to add comment.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [tweetId]);

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className="mt-4 border-t pt-4">
      <h3 className="font-semibold mb-2">Comments</h3>

      <div className="mb-4 flex gap-2">
        <Avatar src={user?.profilePhoto} size="40" round={true} />
        <input
          type="text"
          placeholder="Write a comment..."
          className="flex-grow border-none bg-transparent focus:outline-none focus:ring-0 px-2 py-1"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleAddComment(); }}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-500 text-white px-5 py-0 rounded-3xl hover:bg-blue-600"
        >
          Post
        </button>
      </div>

      {comments.length === 0 && <p>No comments yet.</p>}

      {comments.map((comment) => (
        <div key={comment._id} className="flex items-start gap-2 mb-3">
          <Avatar src={comment.userId?.profilePhoto} size="35" round={true} />
          <div>
            <p className="font-semibold">{comment.userId?.name || "Unknown"}</p>
            <p>{comment.text}</p>
            <small className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;
