import React from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import UpdateAccount from './UpdateAccount';

import UpdateAvatar from './UpdateAvatar';
import UpdateCoverImage from './UpdateCoverImage';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-10 p-6  shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Settings</h2>
      <div className="space-y-4">
        <button
          onClick={() => navigate('/update-Account')}
          className="w-full bg-white text-black py-2 px-4 rounded-md shadow-sm hover:bg-grey focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Account
        </button>
        
        <button
          onClick={() => navigate('/update-avatar')}
          className="w-full bg-white  text-black py-2 px-4 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Change Avatar
        </button>
        <button
          onClick={() => navigate('/update-cover-image')}
          className="w-full bg-white  text-black py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Change Cover Image
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
