import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Like } from "../models/like.model.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find().populate("owner");
    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"));
});



const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.params.userId; // Ensure userId is correctly obtained from params

    // Check if videoFile and thumbnail are present in req.files
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
        throw new ApiError(400, "Both video file and thumbnail are required");
    }

    const videoLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    // Upload video and thumbnail to Cloudinary
    const video = await uploadOnCloudinary(videoLocalPath); // Implement uploadOnCloudinary function
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath); // Implement uploadOnCloudinary function

    // Create new video document in MongoDB
    const newVideo = await Video.create({
        videoFile: video.secure_url, // Assuming uploadOnCloudinary returns a secure_url
        thumbnail: thumbnail.secure_url, // Assuming uploadOnCloudinary returns a secure_url
        title,
        description,
        owner: userId // Assuming userId is the owner of the video
    });

    return res.status(200).json(new ApiResponse(200, newVideo, "Video uploaded successfully"));
});

const getVideosofuser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log(`Received userId: ${userId}`); // Log the userId

    const videos = await Video.find({ owner: userId }).populate('owner');

    if (!videos || videos.length === 0) {
        console.log(`No videos found for userId: ${userId}`); // Log if no videos are found
        return res.status(404).json(new ApiResponse(404, { videos: [] }, "No videos found for this user"));
    }

    console.log(`Found ${videos.length} videos for userId: ${userId}`); // Log the number of videos found
    return res.status(200).json(new ApiResponse(200, { videos }, "Videos fetched successfully"));
});


const getyourvideos = asyncHandler(async (req, res) => {
    const { userId } = req.params
    const video = await Video.find({owner :userId})
    return res
    .status(200)
    .json(
        new ApiResponse(200,video, "video has been fetched by the id")
    )
})
  
  
  


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    console.log(`Received videoId: ${videoId}`);
    const video = await Video.findById(videoId)
    return res
    .status(200)
    .json(
        new ApiResponse(200,video, "video has been fetched by the id")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title, description} = req.body
    //TODO: update video details like title, description, thumbnail
    const thumbnailLocalPath = req.file?.path

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "video file is missing")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    const video = await Video.findById(videoId)

    video.title = title
    video.description = description
    video.thumbnail = thumbnail

    await video.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200,video, "video has been updated successfully")
    )

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        // Delete the video
        await Video.findByIdAndDelete(videoId);

        // Delete associated likes
        await Like.deleteMany({ video: videoId });

        return res.status(200).json(
            new ApiResponse(200, "Video has been deleted successfully")
        );
    } catch (error) {
        console.error('Error deleting video and likes:', error);
        return res.status(500).json(
            new ApiResponse(500, "Failed to delete video")
        );
    }
});




const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    getVideosofuser,
    getyourvideos,
    
}
