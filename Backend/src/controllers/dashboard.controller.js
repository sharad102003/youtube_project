import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    try{const {channelId} = req.params
    const channelvideos = await Video.findById({owner : channelId})
    return res
    .status(200)
    .json({channelvideos});
}catch (error) {
    console.error(error);
    res
    .status(500)
    .json({ error: 'Server error' });
}
})

export {
    getChannelStats, 
    getChannelVideos
    }