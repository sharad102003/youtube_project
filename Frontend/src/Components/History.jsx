import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from "../context/contextApi";
import { Link } from 'react-router-dom';

const History = () => {
  const { user } = useContext(Context);
  const [videos, setVideos] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          withCredentials: true
        });
        console.log(response.data.data);
        setVideos(response.data.data);
      } catch (error) {
        if (error.response) {
          console.error('Server responded with error:', error.response.data);
        } else if (error.request) {
          console.error('No response received from server:', error.request);
        } else {
          console.error('Error setting up the request:', error.message);
        }
        setMessage('Failed to fetch videos');
      }
    };

    fetchVideos();
  }, []);

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/history/${videoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        withCredentials: true
      });
      setVideos(videos.filter(video => video._id !== videoId));
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.data);
      } else if (error.request) {
        console.error('No response received from server:', error.request);
      } else {
        console.error('Error setting up the request:', error.message);
      }
      setMessage('Failed to delete video from history');
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6  dark:bg-black text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Watch History</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.length > 0 ? (
          videos.map(video => (
            
              <div className="relative overflow-hidden rounded-md shadow-lg ">
                <Link key={video._id} to={`/video/${video._id}`} className="block group">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover transition-transform duration-200 transform group-hover:scale-105" />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <img src={video.owner.avatar} alt={video.owner.username} className="w-8 h-8 rounded-full mr-2" />
                    <h4 className="text-sm font-semibold text-white">{video.owner.username}</h4>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-blue-600">{video.title}</h3>
                  <p className="text-sm text-gray-400 truncate">{video.description}</p>
                 
                </div>
                </Link>
                <button
                    onClick={() => handleDelete(video._id)}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
              </div>
           
            
          ))
        ) : (
          <p className="text-center col-span-full">No videos found</p>
        )}
      </div>
    </div>
  );
};

export default History;
