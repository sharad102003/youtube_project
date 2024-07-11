import React from "react";

import { AiFillHome, AiOutlineFlag } from "react-icons/ai";

import { FiFilm } from "react-icons/fi";

import { FiSettings, FiHelpCircle } from "react-icons/fi";
import {  AiOutlineHistory, AiFillLike, AiOutlineLogout} from 'react-icons/ai';


export const categories = [
    { name: "New", icon: <AiFillHome />, type: "home" },
  { name: "History", icon: <AiOutlineHistory />, type: "history" },
  { name: "Liked Videos", icon: <AiFillLike />, type: "liked_videos" },
    { name: "Your Videos", icon: <FiFilm />, type: "menu" },
    
    { name: "Settings", icon: <FiSettings />, type: "menu" },
    { name: "Logout", icon: <AiOutlineLogout />, type: "logout" }
    
];
