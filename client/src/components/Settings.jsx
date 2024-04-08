import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../css/Settings.css';

const Settings = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    profilePicture: ''
  });

  // const handleChange = (e) => {
  //   if (e.target.name === 'profilePicture') {
  //     setFormData({
  //       ...formData,
  //       profilePicture: e.target.files[0] 
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: e.target.value
  //     });
  //   }
  // };

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({
                ...formData,
                profilePicture: reader.result // Store the data URL
            });
        };
        reader.readAsDataURL(file);
    } else {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
};


  // const handleChange = (e) => {
  //   if (e.target.name === 'profilePicture') {
  //     const file = e.target.files[0];
  //     setFormData({
  //       ...formData,
  //       profilePicture: file 
  //     });
  //   } else {
  //     setFormData({
  //       ...formData,
  //       [e.target.name]: e.target.value
  //     });
  //   }
  // };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('Token not found.');
    }
    const decodedToken = token ? jwtDecode(token) : null;
    const userId = decodedToken ? decodedToken._id : null;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data'
        }
    };

    const formDataToSend = new FormData(); 
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('profilePicture', formData.profilePicture); 
    // if (formData.profilePicture !== null && formData.profilePicture !== undefined ) {
    //   formDataToSend.append('profilePicture', formData.profilePicture.fileName); 
    //   formDataToSend.append('profilePicture', formData.profilePicture.fileType);
    //   formDataToSend.append('profilePicture', formData.profilePicture.data);
    // }
    console.log(formData);
    console.log(formDataToSend);
    
    
    try {
      const res = await axios.put(`http://localhost:8000/api/user/${userId}`, formDataToSend, config);
      console.log('Update successful:', res.data);
      
    } catch (error) {
      console.error('Update failed:', error);
      
    }
  };

  return (
    <div className='settings-container'>
      <h2>Settings</h2>
      <form encType='multipart/form-data' onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} />
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
        <label>Profile Picture:</label>
        <input type="file" name="profilePicture" onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Settings;
