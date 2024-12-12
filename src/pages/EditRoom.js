import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './AddRoom.css';

const EditRoom = () => {
  const { id } = useParams();  // Room ID from the URL
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    room_number: '',
    room_type: '',
    total_slots: '',
    remaining_slots: ''
  });
  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);

  // Fetch room and tenant details on component mount
  useEffect(() => {
    axios.get(`http://192.168.1.21/finalprojectv2/get_room_details.php?id=${id}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setRoom(response.data.room);
          setTenants(response.data.tenants);
        } else {
          setError(response.data.message || 'Error fetching room details');
        }
      })
      .catch((error) => {
        setError('An unexpected error occurred.');
      });
  }, [id]);

  // Handle form submission to update room
const handleSubmit = (e) => {
  e.preventDefault();
  
  axios.post('http://192.168.1.21/finalprojectv2/update_roomjs.php', {
    id: id, // Pass the id parameter from the URL
    room_number: room.room_number,
    room_type: room.room_type,
    total_slots: room.total_slots,
    remaining_slots: room.remaining_slots
  })
  .then((response) => {
    if (response.data.status === 'success') {
      navigate('/room_manage'); // Redirect to room management page
    } else {
      setError(response.data.message || 'Error updating room');
    }
  })
  .catch((error) => {
    setError('An unexpected error occurred.');
  });
};

  const handleChange = (e) => {
    setRoom({
      ...room,
      [e.target.name]: e.target.value
    });
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    
    <div className="content">
        <div className="sidebar">
        <div className="logo-container">
          <img src="images/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><button onClick={goToDashboard}>Manage Rooms</button></li>
          <li><a href="/add_room" className="active">Edit Room</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
      <h2>Edit Room</h2>
      
      <div className="form-container">
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="room_number">Room Number:</label>
          <input
            type="text"
            id="room_number"
            name="room_number"
            value={room.room_number}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="room_type">Room Type:</label>
          <select
            id="room_type"
            name="room_type"
            value={room.room_type}
            onChange={handleChange}
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
            name="total_slots"
            value={room.total_slots}
            onChange={handleChange}
            required
          />

          <label htmlFor="remaining_slots">Remaining Slots:</label>
          <input
            type="number"
            id="remaining_slots"
            name="remaining_slots"
            value={room.remaining_slots}
            onChange={handleChange}
            required
          />

          <button type="submit">Update Room</button>
        </form>
      </div>

      <div className="tenants-list">
        <h3>Tenants:</h3>
        {tenants.length === 0 ? (
          <p>No tenants assigned to this room.</p>
        ) : (
          <ul>
            {tenants.map((tenant) => (
              <li key={tenant.id}>
                {tenant.full_name} - {tenant.gender} ({tenant.mobile_number})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EditRoom;
