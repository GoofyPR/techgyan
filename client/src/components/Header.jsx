import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
// import '../css/Header.css';
import '../css/Navbar.css';
// import { IoReorderThreeOutline } from "react-icons/io5";
import { CgMenuLeft } from "react-icons/cg";
import { FaUserCircle } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { jwtDecode } from 'jwt-decode';
import { getGravitarURL } from '../gravitarUtils';
import defaultpfp from '../assets/defaultpfp.png';
import axios from 'axios';
import { FcSettings } from "react-icons/fc";
import { RxExit } from "react-icons/rx";
import { CgClose } from "react-icons/cg";

// import profileIcon from '../assets/profile-icon.png';


const Header = ({ isLoggedIn ,onToggleSidebar, onSearch }) => {
  // const [fixed, setFixed] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userData, setUserData] = useState(null);
  // const prevIsLoggedIn = useRef(isLoggedIn);

  
  const navigate = useNavigate();

  // const setNavbarFixed = () => {
  //   if (window.scrollY >= 392) {
  //     setFixed(true);
  //   } else {
  //     setFixed(false);
  //   }
  // }

  // useEffect(() => {
  //   window.addEventListener("scroll", setNavbarFixed);

  //   return () => {
  //     window.removeEventListener("scroll", setNavbarFixed);
  //   };
  // }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('token not found.');
      }
      const decodedToken = token ? jwtDecode(token) : null;
      const userId = decodedToken ? decodedToken._id : null;

      const config = {
          headers: {
              Authorization: `Bearer ${token}`
          }
      };
      try {
        const response = await axios.get(`http://localhost:8000/api/userinfo/${userId}`,config); 
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isLoggedIn) {
      fetchUserData();
    }
  }, [isLoggedIn]);

  const handleSignup = () => {
    navigate('/signup');
  }

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchInput(value);
    if(value === '') {
      onSearch('');
    }
  }

  const handleSearchSubmit = () => {
    onSearch(searchInput);
  }

  const handleUserIconClick = () => {
    setShowUserInfo(!showUserInfo); 
  }

  const handleSignin = () => {
    navigate('/login');
  }

  const handleSignout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  }

  const getProfilePicture = (email) => {
    return userData && userData.profilePicture ? userData.profilePicture : getGravitarURL(email);
  }

  const navSettings = () => {
    navigate('/Settings');
  }

  return (
    <>
      <nav className="header-container">
      {/* <nav className={`header-container ${fixed ? 'fixed' : ''}`}> */}
        <div className="logo-container">
          {/* <IoReorderThreeOutline className='icon' onClick={onToggleSidebar} /> */}
          <div className="menu-icon-container" onClick={onToggleSidebar} >
            <CgMenuLeft className='icon' onClick={onToggleSidebar} />

          </div>
          <NavLink to='/' className='logo' >TechGyan</NavLink>

        </div>
        {/* <input type="search" className='search-box' placeholder='Search' /> */}
        <div className="search-container">
          <div className="search-box-container">
            <AiOutlineSearch className='search-icon' />
            <input
              type="search"
              className='search-box'
              placeholder='Search'
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearchSubmit();
                }
              }}
            />

          </div>

        </div>
        {/* <div className="nav-con">
          
          <ul className='nav-links'>
            <NavLink to='/login' activeclassname='active-link' className={"login"}><li>Log in</li></NavLink>
            
          </ul>
          <button className='btn' onClick={handleSignup} >Sign up</button>

        </div> */}
        <div className="nav-con">
          {isLoggedIn ? (
            <div className='profile-icon' onClick={handleUserIconClick} >
              {/* <img className='user-icon' src={profileIcon} alt="Profile" /> */}
              <FaUserCircle className='user-icon' onClick={handleUserIconClick} />
              {showUserInfo && (
                <div className="user-info-popup">
                  <div className="popup-inner-container">
                    <div className="popup-widget">
                      {userData ? (
                        <>
                          <div className="my-tracker1">
                            <span className='welcome-con'>Welcome to MyTracker</span>
                            <div className="close-icon-container" onClick={handleUserIconClick} >
                              <CgClose className='close-icon' />

                            </div>
                          </div>
                          {/* <small className="last-login">Your last login: {userData ? new Date(userData.updatedAt).toLocaleString() : "-" }</small> */}
                          <div className='profile-picture1'><img src={getProfilePicture(userData.email)} alt="Profile" /></div>
                          <div className='full-name1'>{userData.firstName} {userData.lastName}</div>
                          <div className="my-tracker-con1">
                            <div className="settings-con">
                              <div className="settings-items" onClick={navSettings} >
                                <FcSettings className='settings-icon' onClick={navSettings} />
                                <button className='settings1' onClick={navSettings}>Settings</button>

                              </div>

                            </div>
                            {/* <span className='line'>|</span> */}
                            <div className="sign-out-con">
                              <div className="sign-out-items" onClick={handleSignout} >
                                <RxExit className='sign-out-icon' onClick={handleSignout} />
                                <button className='my-tracker-btn1' onClick={handleSignout} >Sign out</button>

                              </div>

                            </div>

                          </div>
                        </>
                      ) : (
                        <>
                          <div className="my-tracker1"><span className='welcome-con'>Welcome to MyTracker</span></div>
                          {/* <small className="last-login">Your last login: {userData ? new Date(userData.updatedAt).toLocaleString() : " Never " }</small> */}
                          <div className='profile-picture1'><img src={defaultpfp} alt="Profile" /></div>
                          <div className='full-name1'> - - </div>
                          <div className="my-tracker-con1">
                            <button className='my-tracker-btn1' onClick={handleSignin} >Log in</button>

                          </div>
                        </>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <ul className='nav-links'>
                <NavLink to='/login' activeclassname='active-link' className={"login"}><li>Log in</li></NavLink>
              </ul>
              <button className='btn' onClick={handleSignup} >Sign up</button>
            </>
          )}
        </div>
      </nav>
      
    </>
  )
}

export default Header;
