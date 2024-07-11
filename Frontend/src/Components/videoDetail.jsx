import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Context } from "../context/contextApi";

const VideoDetail = () => {
  const { user } = useContext(Context);
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/videos/${videoId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          withCredentials: true
        });
        setVideo(response.data.data);
        findLike();
        addToWatchHistory(videoId);
      } catch (error) {
        handleError(error, 'Failed to fetch video details');
      }
    };

    fetchVideoDetails();
    fetchComments(currentPage);
  }, [videoId, user, currentPage]);

  const addToWatchHistory = async (videoId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/history`, 
        { videoId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          withCredentials: true
        }
      );
    } catch (error) {
      console.error('Failed to add to watch history:', error.message);
    }
  };

  const fetchComments = async (page) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/comments/${videoId}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      setComments(response.data.comments);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      handleError(error, 'Failed to fetch comments');
    }
  };

  const findLike = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/likes/toggle/v/${videoId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      setLiked(response.data.userHasLiked);
    } catch (error) {
      handleError(error, 'Failed to toggle like');
    }
  };

  const toggleLike = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/likes/togglelike/v/${videoId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      setVideo({ ...video, likes: response.data.likes });
      findLike();
    } catch (error) {
      handleError(error, 'Failed to toggle like');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (editCommentId) {
      handleCommentUpdate(editCommentId, editCommentText);
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/comments/${videoId}`, {
          text: newComment
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          withCredentials: true
        });
        setComments([...comments, response.data.comment]);
        setNewComment('');
        fetchComments(currentPage);
      } catch (error) {
        handleError(error, 'Failed to post comment');
      }
    }
  };

  const handleCommentUpdate = async (commentId, updatedText) => {
   
    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/comments/c/${commentId}`, {
        text: updatedText
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      setEditCommentId(null);
      setEditCommentText('');
      fetchComments(currentPage);
    } catch (error) {
      handleError(error, 'Failed to update comment');
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/comments/c/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      handleError(error, 'Failed to delete comment');
    }
  };

  const handleError = (error, defaultMessage) => {
    if (error.response) {
      console.error('Server responded with error:', error.response.data);
    } else if (error.request) {
      console.error('No response received from server:', error.request);
    } else {
      console.error('Error setting up the request:', error.message);
    }
    setMessage(defaultMessage);
  };

  const renderComments = () => {
    return comments.map(comment => (
      <li key={comment._id} className="mb-2 flex items-start">
        <img
          src={comment.owner ? comment.owner.avatar : 'default-avatar-url'}
          alt={`${comment.owner ? comment.owner.username : 'Anonymous'}'s avatar`}
          className="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <p><strong>{comment.owner ? comment.owner.username : 'Anonymous'}:</strong> {comment.content}</p>
          {user && user._id === comment.owner._id && (
            <div>
              <button onClick={() => {
                setEditCommentId(comment._id);
                setEditCommentText(comment.content);
                setNewComment(comment.content);
              }} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleCommentDelete(comment._id)} className="ml-2 text-red-600 hover:underline">Delete</button>
            </div>
          )}
        </div>
      </li>
    ));
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 dark:bg-black text-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-100">Video Details</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      {video ? (
        <div>
          <h3 className="text-xl font-semibold text-gray-100">{video.title}</h3>
          <p className="text-gray-300">{video.description}</p>
          <div className="relative w-full" style={{ paddingTop: '50%' }}>
            <video controls src={video.videoFile} className="absolute top-0 left-0 w-full h-full rounded-md" />
          </div>
          <div className="flex items-center mt-4">
            <button
              onClick={toggleLike}
              className={`px-4 py-2 rounded-md text-white ${liked ? 'bg-red-500' : 'bg-gray-500'}`}
            >
              {liked ? 'Unlike' : 'Like'}
            </button>
          </div>
          <div className="mt-6">
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={editCommentId ? editCommentText : newComment}
                onChange={(e) => editCommentId ? setEditCommentText(e.target.value) : setNewComment(e.target.value)}
                className="w-full p-2 border rounded-md bg-gray-800 text-gray-200"
                placeholder="Add a comment"
                rows="3"
              />
              <button type="submit" className="px-4 py-2 mt-2 rounded-md bg-blue-500 text-white">
                {editCommentId ? 'Update Comment' : 'Submit'}
              </button>
            </form>
            <h4 className="text-lg font-semibold text-gray-100 py-4">Comments</h4>
            <ul className="mt-4">
              {renderComments()}
            </ul>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 rounded-md bg-gray-300 text-gray-800"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-300">Loading...</p>
      )}
    </div>
  );
};

export default VideoDetail;
