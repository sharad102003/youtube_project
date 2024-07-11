import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const {userId} = req.params

    const createtweet = await  new Tweet.create({
        
        content: content,
        owner : userId
    });
    await createtweet.save();
    res.json({ message: 'Comment added successfully', Playlist: createplaylist });
})

const getUserTweets = asyncHandler(async (req, res) => {
    try{const {userId} = req.params
    const gettweets = await Tweet.findById({owner : userId})
    res
    .status(200)
    .json({ gettweets });}
    catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: 'Server error' });
    }

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    try 
    {const {tweetId} = req.params
    const {content} = req.body
    const updatetweets = awaitTweet.findById(tweetId)
    updatetweets.content = content
    await updatetweets.save();
    return res
    .status(200)
    .json({ playlist })}
    catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: 'Server error' });
    }
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
   try{ const {userId} = req.params
    const deletetweets = await Tweet.findByIdAndDelete({owner : userId})
    return res
    .status(200)
    .json({ playlist })}
    catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: 'Server error' });
    }
    // TODO: delete playlist
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
