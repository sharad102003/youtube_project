import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SlMenu } from "react-icons/sl";
import { CgClose } from "react-icons/cg";
import { Context } from "../context/contextApi";

import ytLogo from "../images/yt-logo.png";
import ytLogoMobile from "../images/yt-logo-mobile.png";
import profile from "../images/profile.png";
import { RiVideoAddLine } from "react-icons/ri";
import { FiBell } from "react-icons/fi";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { mobileMenu, setMobileMenu, user } = useContext(Context);
    const [avatar, setAvatar] = useState();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const pageName = pathname?.split("/")?.filter(Boolean)?.[0];

    useEffect(() => {
        if (user) {
            setAvatar(user.avatar);
        }
    }, [user]);

    const mobileMenuToggle = () => {
        setMobileMenu(!mobileMenu);
    };

    const searchQueryHandler = (event) => {
        if (
            (event?.key === "Enter" || event === "searchButton") &&
            searchQuery?.length > 0
        ) {
            navigate(`/searchResult/${searchQuery}`);
        }
    };

    return (
        <div className="sticky top-0 z-10 flex flex-row items-center justify-between h-14 px-4 md:px-5 bg-white dark:bg-black">
            <div className="flex h-5 items-center">
                {pageName !== "video" && (
                    <div
                        className="flex md:hidden md:mr-6 cursor-pointer items-center justify-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]"
                        onClick={mobileMenuToggle}
                    >
                        {mobileMenu ? (
                            <CgClose className="text-white text-xl" />
                        ) : (
                            <SlMenu className="text-white text-xl" />
                        )}
                    </div>
                )}
                <Link to="/" className="flex h-5 items-center">
                    <img
                        className="h-full hidden dark:md:block"
                        src={ytLogo}
                        alt="Youtube"
                    />
                    <img
                        className="h-full md:hidden"
                        src={ytLogoMobile}
                        alt="Youtube"
                    />
                </Link>
            </div>
            <div className="flex items-center">
                <div className="hidden md:flex">
                    <Link to="/Upload" className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]">
                        <RiVideoAddLine className="text-white text-xl cursor-pointer" />
                    </Link>
                    <div className="flex items-center justify-center ml-2 h-10 w-10 rounded-full hover:bg-[#303030]/[0.6]">
                        <FiBell className="text-white text-xl cursor-pointer" />
                    </div>
                </div>
                <Link to={user ? `/profile/${user._id}` : "/Signup"} className="flex h-8 w-8 overflow-hidden rounded-full md:ml-4">
                    <img src={avatar ? avatar : profile} alt="profile" />
                </Link>
            </div>
        </div>
    );
};

export default Header;
