import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Context } from "../context/contextApi";

const LikedVideosPage = () => {
    const [likedVideos, setLikedVideos] = useState([]);
    const [message, setMessage] = useState('');
   // const { user, loading: contextLoading } = useContext(Context);

    useEffect(() => {
      
        const fetchLikedVideos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/likes/videos`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    withCredentials: true
                });
                if (response.data.data && response.data.data.likedVideos) {
                    setLikedVideos(response.data.data.likedVideos);
                } else {
                    setMessage('No liked videos found');
                }
            } catch (error) {
                if (error.response) {
                    console.error('Server responded with error:', error.response.data);
                } else if (error.request) {
                    console.error('No response received from server:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
                setMessage('Failed to fetch liked videos');
            }
        };

        fetchLikedVideos();
    }, []);

   

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Liked Videos</h2>
            {message ? (
                <p className="mb-4 text-center text-red-500">{message}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {likedVideos.length > 0 ? (
                        likedVideos
                            .filter(like => like.video) // Filter out likes with null videos
                            .map(like => (
                                <Link key={like.video._id} to={`/video/${like.video._id}`} className="block group">
                                    <div className="relative overflow-hidden rounded-md shadow-lg ">
                                        <img src={like.video.thumbnail} alt={like.video.title} className="w-full h-48 object-cover transition-transform duration-200 transform group-hover:scale-105" />
                                        <div className="p-4">
                                            <div className="flex items-center mb-2">
                                                <img src={like.video.owner.avatar} alt={like.video.owner.username} className="w-8 h-8 rounded-full mr-2" />
                                                <h4 className="text-sm font-semibold text-white">
                                                    {like.video.owner.username}
                                                </h4>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-blue-500">{like.video.title}</h3>
                                            <p className="text-sm text-white truncate">{like.video.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                    ) : (
                        <p className="text-center col-span-full">No liked videos found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default LikedVideosPage;
