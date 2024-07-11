// src/controllers/history.controller.js
import { User} from "../models/user.model.js"
import {Video} from "../models/video.model.js"

// Controller to get the user's watch history
 const getWatchHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    .populate({
      path: 'watchHistory',
      populate: { path: 'owner' }
    });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ data: user.watchHistory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const addToWatchHistory = async (req, res) => {
    try {
      console.log(`Received history request with userId: ${req.user._id} and videoId: ${req.body.videoId}`);
      
      const user = await User.findById(req.user._id);
      if (!user) {
        console.error('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      const video = await Video.findById(req.body.videoId);
      if (!video) {
        console.error('Video not found');
        return res.status(404).json({ message: 'Video not found' });
      }
  
      // Add video to watch history if not already present
      if (!user.watchHistory.includes(video._id)) {
        user.watchHistory.push(video._id);
        await user.save();
      }
  
      res.status(200).json({ message: 'Video added to watch history' });
    } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  const removeFromWatchHistory = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(`Received videoId: ${req.params.videoId}`);
  
      user.watchHistory = user.watchHistory.filter(videoId => videoId.toString() !== req.params.videoId);
      await user.save();
  
      res.status(200).json({ message: 'Video removed from watch history' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
  
export {
   
    getWatchHistory ,
    addToWatchHistory,
    removeFromWatchHistory
}