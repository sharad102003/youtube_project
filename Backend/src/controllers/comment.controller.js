import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

const getVideoComments = asyncHandler(async (req, res) => {
    try {
        // Extract video ID from request parameters
        const { videoId } = req.params;
        // Extract page and limit from query parameters with default values
        const { page = 1, limit = 10 } = req.query;

        // Find all comments associated with the video with pagination
        const comments = await Comment.find({ video: videoId })
            .populate("owner")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get total count of comments for the video (for pagination)
        const totalComments = await Comment.countDocuments({ video: videoId });

        // Respond with the array of comments and additional pagination info
        res.status(200).json({
            comments,
            totalComments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalComments / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});




const addComment = asyncHandler(async (req, res) => {
    try {
        // Extract video ID from request parameters
        const { videoId } = req.params;
        // Extract comment text from request body
        const { text } = req.body;

        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Create a new comment object
        const newComment = await Comment.create({
            content: text,
            owner: req.user._id, // Assuming you have a user object available in the request
            video: videoId
        });

        // Respond with success message and the added comment
        res.json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});




const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    try {
        // Extract video ID from request parameters
        const {commentId} = req.params;
        // Extract comment text from request body
        if(!commentId )
        {
            return res.status(404).json({ error: ' Comment Id not found' });
        }
        
        const { text } = req.body;

       
        //find the comment by the ID
        const comment = await Comment.findById(commentId);

        // Check if the video exists
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        comment.content = text;
        await comment.save();

        // Create a new comment object
        
        // Respond with success message and the added comment
        return res
        .status(200)
        .json({ message: 'Comment added successfully', comment: comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }


        await comment.deleteOne();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
