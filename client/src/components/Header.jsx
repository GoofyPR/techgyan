import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../css/Header.css';
import { IoReorderThreeOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";


// import profileIcon from '../assets/profile-icon.png';


const Header = ({ isLoggedIn ,onToggleSidebar, onSearch }) => {
  const [fixed, setFixed] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  // const prevIsLoggedIn = useRef(isLoggedIn);

  
  const navigate = useNavigate();

  const setNavbarFixed = () => {
    if (window.scrollY >= 392) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", setNavbarFixed);

    return () => {
      window.removeEventListener("scroll", setNavbarFixed);
    };
  }, []);

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

  return (
    <>
      <nav className={`header-container ${fixed ? 'fixed' : ''}`}>
        <div className="logo-container">
          <IoReorderThreeOutline className='icon' onClick={onToggleSidebar} />
          <NavLink to='/' className='logo' >TechGyan</NavLink>

        </div>
        {/* <input type="search" className='search-box' placeholder='Search' /> */}
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
        {/* <div className="nav-con">
          
          <ul className='nav-links'>
            <NavLink to='/login' activeclassname='active-link' className={"login"}><li>Log in</li></NavLink>
            
          </ul>
          <button className='btn' onClick={handleSignup} >Sign up</button>

        </div> */}
        <div className="nav-con">
          {isLoggedIn ? (
            <div className='profile-icon'>
              {/* <img className='user-icon' src={profileIcon} alt="Profile" /> */}
              <FaUserCircle className='user-icon' />

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
