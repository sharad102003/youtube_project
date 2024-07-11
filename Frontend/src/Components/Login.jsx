import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import ProfilePage from './Profile';


const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null); // State to store logged-in user data
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = { username, email, password };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/users/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Set the logged-in user data
      setLoggedInUser(user);
      navigate("/");

      // Optionally, navigate to a different page after login
      // navigate('/ProfilePage');
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-black shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      {loggedInUser && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-sm">
          <h3 className="text-xl font-bold">Welcome, {loggedInUser.username}!</h3>
          <p>Email: {loggedInUser.email}</p>
        </div>
      )}
      <p className="mt-4 text-center text-white">
        Don't have an account?{' '}
        <Link to="/Signup" className="text-indigo-500 hover:underline">
          Sign Up
        </Link>
        
      </p>
    </div>
  );
};

export default Login;


