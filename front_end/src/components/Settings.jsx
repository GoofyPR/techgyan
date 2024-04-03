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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const res = await axios.put(`http://localhost:8000/api/user/${userId}`, formData, config);
      console.log('Update successful:', res.data);
      
    } catch (error) {
      console.error('Update failed:', error);
      
    }
  };

  return (
    <div className='settings-container'>
      <h2>Settings</h2>
      <form onSubmit={handleSubmit}>
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
        <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Settings;
