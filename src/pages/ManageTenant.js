import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageTenant = () => {
  const [tenants, setTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

  // Fetch tenants from API
  useEffect(() => {
    axios
      .get('http://192.168.1.21/finalprojectv2/get_tenants.php') // Your API endpoint
      .then((response) => {
        if (response.data.status === 'success') {
          setTenants(response.data.tenants);
        } else {
          console.error('Error fetching tenants:', response.data.message);
        }
      })
      .catch((error) => console.error('Error fetching tenants:', error));
  }, []);

  // Handle tenant deletion
  const handleDeleteTenant = (id) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      axios
        .delete(`http://192.168.1.21/finalprojectv2/delete_tenantjs.php?id=${id}`)
        .then((response) => {
          if (response.data.status === 'success') {
            setTenants(tenants.filter((tenant) => tenant.id !== id));
          } else {
            alert('Error deleting tenant');
          }
        })
        .catch((error) => console.error('Error deleting tenant:', error));
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter tenants based on search query
  const filteredTenants = tenants.filter((tenant) =>
    tenant.full_name.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="content">
      <div className="sidebar">
        <div className="logo-container">
          <img src="images/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><a href="/dashboard">Manage Rooms</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants" className="active">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      <h2>Manage Tenants</h2>
      <div className="table-container">
        <div className="table-controls">
          <input
            type="text"
            id="searchBar"
            placeholder="Search Tenants"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <table id="tenantsTable">
          <thead>
            <tr>
              <th>ID#</th>
              <th>Name</th>
              <th>Room</th>
              <th>Stay From</th>
              <th>Stay To</th>
              <th>Period Remaining</th>
              <th>Gender</th>
              <th>Mobile#</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>{tenant.id}</td>
                <td>{tenant.full_name}</td>
                <td>{tenant.room_number} ({tenant.room_type})</td>
                <td>{tenant.stay_from}</td>
                <td>{tenant.stay_to}</td>
                <td>
                  {new Date(tenant.stay_to) > new Date()
                    ? Math.floor(
                        (new Date(tenant.stay_to) - new Date()) / (1000 * 60 * 60 * 24)
                      ) + ' days remaining'
                    : 'Expired'}
                </td>
                <td>{tenant.gender}</td>
                <td>{tenant.mobile_number}</td>
                <td>
                  <button 
                  className="edit-btn"
                  onClick={() => navigate(`/edit_tenant/${tenant.id}`)}
                   >
                    Edit
                    </button>
                  <button className="delete-btn" onClick={() => handleDeleteTenant(tenant.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTenant;
