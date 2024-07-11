import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
//import { User } from "../models/user.model"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const {userId} = req.params

    const createplaylist = await Playlist.create({
        name: name,
        description: description,
        owner : userId
    });
    await createplaylist.save();
    res.json({ message: 'Comment added successfully', Playlist: createplaylist });

    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try{
        const {userId} = req.params
    const getuserplaylist = await Playlist.find({ owner: userId });
    res
    .status(200)
    .json({ getuserplaylist });}
    catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: 'Server error' });
    }
   
})

const getPlaylistById = asyncHandler(async (req, res) => {
    try{
        const {playlistId} = req.params
    const getplaylistbyid = await Playlist.findById({ Playlist: playlistId  });
    return res
    .status(200)
    .json({ getplaylistbyid });
} catch (error) {
    console.error(error);
    res
    .status(500)
    .json({ error: 'Server error' });
}
    
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
   try{ const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId);
    playlist.videos.push(videoId);
    await playlist.save();
    return res
    .status(200)
    .json({ playlist })
}
catch (error) {
    console.error(error);
    res
    .status(500)
    .json({ error: 'Server error' });
}
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try{ const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
    }

    const video = playlist.videos.indexOf(videoId);
        if (video !== -1) {
            playlist.videos.splice(index, 1);
        }

        // Save the updated playlist document
        await playlist.save();
    return res
    .status(200)
    .json({ playlist })
}
catch (error) {
    console.error(error);
    res
    .status(500)
    .json({ error: 'Server error' });
}
})

const deletePlaylist = asyncHandler(async (req, res) => {
    try{const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId);
    await Playlist.findByIdAndDelete(playlistId);
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

const updatePlaylist = asyncHandler(async (req, res) => {
    try{const {playlistId} = req.params
    const {name, description} = req.body
    const playlist = await Playlist.findById(playlistId);
    playlist.name = name;
    playlist.description = description;
    await playlist.save();
    return res
    .status(200)
    .json({ playlist })}
    catch (error) {
        console.error(error);
        res
        .status(500)
        .json({ error: 'Server error' });
    }


    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
