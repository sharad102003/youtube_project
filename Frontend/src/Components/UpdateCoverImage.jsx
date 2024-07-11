import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdatecoverImage = () => {
  const [coverImage, setcoverImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handlecoverImageChange = (e) => {
    setcoverImage(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('coverImage', coverImage);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/cover-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true,
        }
      );
      setMessage('coverImage updated successfully');
    } catch (error) {
      setMessage('Failed to update coverImage');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update coverImage</h2>
      {message && <p className="mb-4 text-center text-red-500">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Avatar</label>
          <input
            type="file"
            onChange={handlecoverImageChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update coverImage
        </button>
      </form>
    </div>
  );
};

export default UpdatecoverImage;
