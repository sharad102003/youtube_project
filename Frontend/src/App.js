import React from 'react';
import Signup from './Components/Signup';
import Header from './Components/Header';
import LeftNav from './Components/leftNav';
import { AppContext } from './context/contextApi';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Components/Login';
import Upload from './Components/Upload';
import ProfilePage from './Components/Profile';
import Logout from './Components/Logout';
import SettingsPage from './Components/Setting';
import UpdateAccount from './Components/UpdateAccount';
import UpdateAvatar from './Components/UpdateAvatar';
import UpdateCoverImage from './Components/UpdateCoverImage';
import Feed from './Components/Feed';
import VideoDetail from './Components/videoDetail';
import LikedVideosPage from './Components/Likedvideos';
import VideoPage from './Components/Yourvideos';
import History from './Components/History';

function App() {
  return (
    <AppContext>
      <BrowserRouter>
        <div className="flex flex-col h-full dark:bg-black">
          <Header />
          <div className="flex flex-1 dark:bg-black">
            <LeftNav />
            <main className="flex-1 p-4 dark:bg-black">
              <Routes>
                <Route path="/signup" element={<Signup />} />
                <Route path="/history" element={<History />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/update-account" element={<UpdateAccount />} />
                <Route path="/" element={<Feed />} />
                <Route path="/video/:videoId" element={<VideoDetail />} />
                <Route path="/likedvideos" element={<LikedVideosPage />} />
                <Route path="/yourvideos" element={<VideoPage />} />
                <Route path="/update-avatar" element={<UpdateAvatar />} />
                <Route path="/update-cover-image" element={<UpdateCoverImage />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AppContext>
  );
}

export default App;
