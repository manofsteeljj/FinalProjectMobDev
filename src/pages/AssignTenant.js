import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AssignTenant.css'

const AssignTenant = ({ tenantId }) => {
  const [rooms, setRooms] = useState([]); // Default as empty array
  const [roomId, setRoomId] = useState('');
  const [stayFrom, setStayFrom] = useState('');
  const [stayTo, setStayTo] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch available rooms from the API
    axios.get('http://192.168.1.21/finalprojectv2/get_available_roomsjs.php')
      .then((response) => {
        console.log('API Response:', response.data);  // Log the full response
  
        if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
          // Filter rooms with remaining slots > 0
          const availableRooms = response.data.data.filter(room => room.remaining_slots > 0);
  
          if (availableRooms.length > 0) {
            setRooms(availableRooms);
          } else {
            setMessage('No rooms available with remaining slots.');
          }
        } else {
          setMessage('Failed to fetch rooms or rooms data is not in expected format');
        }
      })
      .catch((error) => {
        console.error('Error fetching rooms:', error);
        setMessage('Error fetching rooms');
      });
  }, []);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      tenant_id: tenantId,
      room_id: roomId,
      stay_from: stayFrom,
      stay_to: stayTo,
    };

    // Send POST request to the API to assign the tenant to a room
    axios.post('http://192.168.1.21/finalprojectv2/assign_tenantjs.php', data)
      .then((response) => {
        if (response.data.status === 'success') {
          setMessage('Tenant successfully assigned!');
        } else {
          setMessage(response.data.message);
        }
      })
      .catch((error) => {
        console.error('Error assigning tenant:', error);
        setMessage('Error assigning tenant');
      });
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  // Ensure that rooms is always an array before calling map
  if (!Array.isArray(rooms)) {
    return <div>Error: Rooms data is not in the expected format.</div>;
  }

  return (
    <div className="container">
        {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="images/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><button onClick={goToDashboard}>Manage Rooms</button></li>
          <li><a href="/add_room" className="active">Assign Tenant</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
      <div className="content">
        <h2>Assign Tenant to Room</h2>
        {message && <div className="message">{message}</div>}
        <form onSubmit={handleSubmit}>
            <label htmlFor="room_id">Room:</label>
            <select
            id="room_id"
            name="room_id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
            >
            <option value="">Select a room</option>
            {rooms.length > 0 ? (
                rooms.map((room) => (
                <option key={room.id} value={room.id}>
                    {room.room_number} ({room.room_type})
                </option>
                ))
            ) : (
                <option disabled>No rooms available</option>
            )}
            </select>

            <label htmlFor="stay_from">Stay From:</label>
            <input
            type="date"
            id="stay_from"
            name="stay_from"
            value={stayFrom}
            onChange={(e) => setStayFrom(e.target.value)}
            required
            />

            <label htmlFor="stay_to">Stay To:</label>
            <input
            type="date"
            id="stay_to"
            name="stay_to"
            value={stayTo}
            onChange={(e) => setStayTo(e.target.value)}
            required
            />

            <button type="submit">Assign Tenant</button>
            </form>
        </div>
    </div>
  );
};

export default AssignTenant;
