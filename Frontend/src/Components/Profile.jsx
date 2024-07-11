import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Context } from "../context/contextApi";

const ProfilePage = () => {
    const { userId } = useParams();
   // console.log(`Received userId: ${userId}`);
    const [videos, setVideos] = useState([]);
    const [message, setMessage] = useState('');
    const { user } = useContext(Context);
    const[avatar, setavatar]  = useState(null);
    const[cover, setcover]  = useState(null);
    const [username, setusername]  = useState();

   

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/videos/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    withCredentials: true
                });
                console.log(response.data.data)
                if (response.data.data && response.data.data.videos) {
                    setVideos(response.data.data.videos);
                } else {
                    setMessage('No videos found');
                }
                 setusername(response.data.data.videos[0].owner.username);
          setavatar(response.data.data.videos[0].owner.avatar);
          setcover(response.data.data.videos[0].owner.coverImage);
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
    }, [userId]);
   
         
        

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 dark:bg-black">
        {user && (
            <div className="mb-6 text-center">
                <div className="relative mb-4">
                    <img 
                        src={cover} 
                        alt="Cover" 
                        className="w-full h-64 object-cover rounded-md" 
                    />
                    <img 
                        src={avatar} 
                        alt="Avatar" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-white absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                    />
                </div>
                <h2 className="text-3xl font-bold py-10 text-white">{username}</h2>
            </div>
        )}
        <div className="max-w-7xl mx-auto mt-10 p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">All Videos</h2>
            {message && <p className="mb-4 text-center text-red-500">{message}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {videos.length > 0 ? (
                    videos.map(video => (
                        <Link key={video._id} to={`/video/${video._id}`} className="block group">
                            <div className="relative overflow-hidden rounded-md shadow-lg">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover transition-transform duration-200 transform group-hover:scale-105" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-500">{video.title}</h3>
                                    <p className="text-sm text-gray-400 truncate">{video.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="text-center col-span-full">No videos found</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default ProfilePage;
