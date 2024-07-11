import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Context } from "../context/contextApi";

const VideoPage = () => {
    const { user } = useContext(Context);
    const [videos, setVideos] = useState([]);
    const [message, setMessage] = useState('');
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [videoToDelete, setVideoToDelete] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/videos/profile/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    withCredentials: true
                });
                if (response.data.data && response.data.data.videos) {
                    setVideos(response.data.data.videos);
                } else {
                    setMessage('No videos found');
                }
            } catch (error) {
                handleError(error, 'No videos found');
            }
        };

        fetchVideos();
    }, [user]);

    const handleDelete = async (videoId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/videos/${videoId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                withCredentials: true
            });
            setVideos(videos.filter(video => video._id !== videoId));
            setShowConfirmDelete(false); // Close the confirmation dialog after deletion
        } catch (error) {
            handleError(error, 'Failed to delete video');
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

    const openDeleteConfirmation = (videoId) => {
        setVideoToDelete(videoId);
        setShowConfirmDelete(true);
    };

    const closeDeleteConfirmation = () => {
        setShowConfirmDelete(false);
    };

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center text-white">Your Videos</h2>
            {message && <p className="mb-4 text-center text-red-500">{message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.length > 0 ? (
                    videos.map(video => (
                        <div key={video._id} className="block group relative">
                            <Link to={`/video/${video._id}`} className="block group">
                                <div className="text-white relative overflow-hidden rounded-md shadow-lg">
                                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover transition-transform duration-200 transform group-hover:scale-105" />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-600">{video.title}</h3>
                                        <p className="text-sm text-gray-200 truncate">{video.description}</p>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={() => openDeleteConfirmation(video._id)}
                                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded-md text-xs"
                            >
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full">No videos found</p>
                )}
            </div>

            {/* Confirmation Dialog */}
            {showConfirmDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
                        <p className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to delete this video?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => handleDelete(videoToDelete)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Confirm Delete
                            </button>
                            <button
                                onClick={closeDeleteConfirmation}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoPage;
