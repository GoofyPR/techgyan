import React,{useState,useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import '../css/Profile.css';
import { getGravitarURL } from '../gravitarUtils';
import defaultpfp from '../assets/defaultpfp.png';
import {useNavigate} from 'react-router-dom';
// import axios from 'axios';

const Profile = () => {
  const [userData,setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token){
      const decodedToken = jwtDecode(token);
      // console.log(decodedToken.email);
      setUserData(decodedToken);
      
    }
  },[]);

  const getProfilePicture = (email) => {
    return userData && userData.profilePicture ? userData.profilePicture : getGravitarURL(email);
  }


  // const handleSignout = async() => {
  //   const token = localStorage.getItem('token');
  //   const signoutConfig = {
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //     }
  //   };
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/signout',{},signoutConfig);
  //     console.log(response);
  //   } catch (error) {
  //     console.error('Error signing out..', error);
  //   }
  // }

  const handleSignout = () => {
    localStorage.removeItem('token');
    window.location.reload(false);
  }

  // const navSettings = () => {
  //   navigate('/Settings');
  // }

  const handleSignin = () => {
    navigate('/login');
  }
  
  // console.log('updated at:', userData.updatedAt);
  // console.log('first name:', userData.firstName);

  return (
    <div className='profile-container'>
      <div className="my-tracker">
        <span className='my-tracker-title'>My Tracker</span>
        <span className='welcome'>Welcome to MyTracker</span>
        {userData ? (
          <>
            <small className="last-login">Your last login: {userData ? new Date(userData.updatedAt).toLocaleString() : "-" }</small>
            <div className='profile-picture'><img src={getProfilePicture(userData.email)} alt="Profile" /></div>
            <div className='full-name'>{userData.firstName} {userData.lastName}</div>
            <div className="my-tracker-con">
              {/* <button className='settings' onClick={navSettings}>Settings</button> */}
              {/* <span className='line'>|</span> */}
              <button className='my-tracker-btn' onClick={handleSignout} >Sign out</button>

            </div>
          </>
        ) : (
          <>
            <small className="last-login">Your last login: {userData ? new Date(userData.updatedAt).toLocaleString() : " Never " }</small>
            <div className='profile-picture'><img src={defaultpfp} alt="Profile" /></div>
            <div className='full-name'> - - </div>
            <div className="my-tracker-con">
              <button className='my-tracker-btn' onClick={handleSignin} >Log in</button>

            </div>
        </>
        )}
      </div>
    </div>
  )
}

export default Profile;