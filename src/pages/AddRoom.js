import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRoom.css'; // Import the CSS file
import './Dashboard.css'; // Import the same CSS for the sidebar (if not already imported)

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState('');
  const [roomType, setRoomType] = useState('Male Double');
  const [totalSlots, setTotalSlots] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      room_number: roomNumber,
      room_type: roomType,
      total_slots: totalSlots,
    };

    console.log('Sending data:', roomData); // Log the data being sent

    try {
      const response = await axios.post('http://192.168.1.21/finalprojectv2/add_roomjs.php', roomData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = response.data; // Axios automatically parses JSON
      console.log('Response:', result); // Log the server response

      if (result.status === 'success') {
        alert('Room added successfully');
        navigate('/dashboard');  // Redirect to the dashboard
      } else {
        alert('Error adding room');
      }
    } catch (error) {
      console.error('Error:', error);

      if (error.response) {
        // If the server responds with an error
        console.error('Response error:', error.response);
        alert(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        // If no response was received
        console.error('Request error:', error.request);
        alert('Error: No response from the server.');
      } else {
        // Other errors (e.g., network issues)
        console.error('Error message:', error.message);
        alert('There was an issue adding the room.');
      }
    }
  };

  return (
    <div className="container">
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

      <div className="content">
        <h2>Add New Room</h2>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label htmlFor="room_number">Room Number:</label>
            <input
              type="text"
              id="room_number"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              required
            />

            <label htmlFor="room_type">Room Type:</label>
            <select
              id="room_type"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
            >
              <option value="Male Double">Male Double</option>
              <option value="Female Double">Female Double</option>
              <option value="Female Single">Female Single</option>
              <option value="Male Single">Male Single</option>
            </select>

            <label htmlFor="total_slots">Total Slots:</label>
            <input
              type="number"
              id="total_slots"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              required
            />

            <button type="submit">Add Room</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
