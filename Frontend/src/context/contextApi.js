import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const Context = createContext();

export const AppContext = (props) => {
  
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
 




  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          withCredentials: true,
        });
        console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      }
    };

    fetchUserProfile();
  }, []);
  const toggleMobileMenu = () => {
    console.log("Toggling mobile menu"); // Debugging statement
    setMobileMenu(prevState => !prevState);
};


  return (
    <Context.Provider
      value={{
        
        mobileMenu,
        setMobileMenu,
        isToggled,
        setIsToggled,
        user,
        setUser,
        message,
        toggleMobileMenu,
       
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
