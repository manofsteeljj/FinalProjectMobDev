import React, { useState } from 'react';

const AddNewFacility = () => {
  const [equipmentType, setEquipmentType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Available');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = {
      equipment_type: equipmentType,
      description: description,
      status: status
    };

    try {
      const response = await fetch('http://192.168.1.2/finalprojectv2/add_facilityjs.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setMessage('Facility added successfully!');
      } else {
        setMessage('Failed to add facility.');
      }
    } catch (error) {
      console.error('Error adding facility:', error);
      setMessage('Error adding facility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
         <div className={`sidebar`}>
        <div className="logo-container">
          <img src="./img/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><a href="/dashboard" >Manage Rooms</a></li>
          <li><a href="/manage_new_tenant" >Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities" className="active">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
      <h2>Add New Facility</h2>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="equipment_type">Equipment Type:</label>
        <input
          type="text"
          id="equipment_type"
          name="equipment_type"
          value={equipmentType}
          onChange={(e) => setEquipmentType(e.target.value)}
          required
        />

        <label htmlFor="description">Description (Model Name):</label>
        <input
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="Available">Available</option>
          <option value="Being Used">Being Used</option>
          <option value="Faulty">Faulty</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Facility'}
        </button>
      </form>
    </div>
  );
};

export default AddNewFacility;
