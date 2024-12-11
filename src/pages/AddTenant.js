import React, { useState } from 'react';
import axios from 'axios';
import './AddRoom.css';

const AddTenant = () => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Male');
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const data = {
      full_name: fullName,
      gender: gender,
      mobile_number: mobileNumber
    };
  
    console.log('Submitting data:', data); // Debugging
  
    try {
      const response = await axios.post('http://192.168.1.21/finalprojectv2/add_tenantjs.php', data);
      console.log('Response:', response); // Debugging
  
      if (response.data.status === 'success') {
        setMessage('Tenant added successfully!');
        setFullName('');
        setGender('Male');
        setMobileNumber('');
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error adding tenant:', error);
      setMessage('Error adding tenant');
    }
  };
  

  return (
    <div className="content">
        {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="images/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><a href="/dashboard">Manage Rooms</a></li>
          <li><a href="/add_room" className="active">Add New Room</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
      <h2>Add New Tenant</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="full_name">Full Name:</label>
        <input
          type="text"
          id="full_name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          type="text"
          id="mobile_number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          required
        />

        <button type="submit">Add Tenant</button>
      </form>
    </div>
  );
};

export default AddTenant;
