import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftNavMenuItem from "./LeftNavMenuItem";
import { categories } from "../utils/constants";
import { Context } from "../context/contextApi";

const LeftNav = () => {
    const { mobileMenu } = useContext(Context);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    return (
        <div
            className={`fixed top-14 left-0 md:relative md:w-[240px] w-[240px] h-[calc(100%-3.5rem)] py-4 bg-black z-10 transition-transform duration-300 ${
                mobileMenu ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
        >
            <div className="flex px-5 flex-col">
                {categories.map((item) => (
                    <React.Fragment key={item.name}>
                        <LeftNavMenuItem
                            text={item.type === "home" ? "Home" : item.name}
                            icon={item.icon}
                            action={() => {
                              if(item.type == "home")
                              {
                                setSelectedCategory("Home")
                                navigate("/");
                              }
                               else {setSelectedCategory(item.name);
                                    navigate(`/${item.name.toLowerCase().replace(' ', '')}`);}
                                
                               
                            }}
                            className={`${
                                selectedCategory === item.name ? "bg-white/[0.15]" : ""
                            }`}
                        />
                        {item.divider && <hr className="my-5 border-white/[0.2]" />}
                    </React.Fragment>
                ))}
                <hr className="my-5 border-white/[0.2]" />
            </div>
        </div>
    );
};

export default LeftNav;
