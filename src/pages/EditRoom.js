import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRoom = () => {
  const { id } = useParams(); // Extract ID from route parameters
  const navigate = useNavigate();

  const [room, setRoom] = useState({
    room_number: '',
    room_type: '',
    total_slots: '',
    remaining_slots: '',
  });

  const [tenants, setTenants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log('Fetching room with ID:', id); // Debug log for ID

      setLoading(true);
      axios
        .get(`http://192.168.1.21/finalprojectv2/get_room_details.php?id=${id}`)
        .then((response) => {
          console.log('API Response:', response.data); // Log API response for debugging
          if (response.data.status === 'success') {
            setRoom(response.data.room);
            setTenants(response.data.tenants);
          } else {
            setError(response.data.message || 'Room not found.');
          }
        })
        .catch((error) => {
          setError('Error fetching room details.');
          console.error('Error:', error); // Log error if fetching fails
        })
        .finally(() => setLoading(false));
    } else {
      setError('No room ID provided.');
      setLoading(false);
    }
  }, [id]);

  const updateRoom = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    console.log('Sending data:', room); // Debug log to check room data before sending
  
    try {
      const response = await axios.put(
        `http://192.168.1.21/finalprojectv2/update_roomjs.php`,
        {
          id: id, // Use ID from the URL parameter
          room_number: room.room_number,
          room_type: room.room_type,
          total_slots: room.total_slots,
          remaining_slots: room.remaining_slots,
        }
      );
  
      console.log('API Response:', response.data); // Log the full response to debug
  
      if (response.data.status === 'success') {
        console.log('Room updated successfully!'); // Debug log for successful update
        navigate('/dashboard'); // Redirect to room management page
      } else {
        setError(response.data.message || 'Error updating room.');
      }
    } catch (error) {
      console.error('Error updating room:', error);
      setError('Error updating room.');
    }
  };
  

  const handleChange = (e) => {
    setRoom({ ...room, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className="sidebar">
        <div className="logo-container">
          <img src="./img/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li>
            <a href="/dashboard">Manage Rooms</a>
          </li>
          <li>
            <a href="/manage_new_tenant">Manage New Tenant</a>
          </li>
          <li>
            <a href="/manage_tenants">Manage Tenants</a>
          </li>
          <li>
            <a href="/manage_facilities">Manage Facilities</a>
          </li>
          <li>
            <a href="/logout">Logout</a>
          </li>
        </ul>
      </div>

      <h2>Edit Room</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={updateRoom}>
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

      <div className="tenants-list">
        <h3>Assigned Tenants:</h3>
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
