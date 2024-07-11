import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    let userHasLiked = false;

    if (existingLike) {
      userHasLiked = true;
    } else {
     
      userHasLiked = false;
    }

    

    res.json({ userHasLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
const toggleLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

    

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
    } else {
      await Like.create({ video: videoId, likedBy: userId });
      
    }

    const totalLikes = await Like.countDocuments({ video: videoId });

    res.json({  likes: totalLikes });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const comment = await Like.findById({comment : commentId})
    if(Like.indexOf(comment._id)===-1)
  {
    Like.push(comment._id);
  }
  else{
     Like.splice(Like.indexOf(comment._id),1);
  }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  //console.log(`like userId: ${userId}`);

  try {
      const likedVideos = await Like.find({ likedBy: userId })
      .populate({
        path: 'video',
        populate: { path: 'owner' }
      });
    

      return res.status(200).json(new ApiResponse(200, { likedVideos }, "Liked videos fetched successfully"));
  } catch (error) {
      return res.status(500).json(new ApiResponse(500, null, "An error occurred while fetching liked videos"));
  }
});


export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    toggleLike
}


