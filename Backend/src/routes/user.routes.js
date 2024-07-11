import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    getProfile,
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
   
    updateAccountDetails
} from "../controllers/user.controller.js";
import { getWatchHistory,addToWatchHistory,removeFromWatchHistory
          
 } from "../controllers/history.controller.js";

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/profile").get(verifyJWT, getProfile)
router.route("/update-account").put(verifyJWT, updateAccountDetails)

router.route("/avatar").put(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").put(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

router.route("/history").get( verifyJWT, getWatchHistory);

// Route to add a video to the user's watch history
router.route("/history").post( verifyJWT, addToWatchHistory);
router.route('/history/:videoId').delete(verifyJWT, removeFromWatchHistory);
export default router