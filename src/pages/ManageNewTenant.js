import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddRoom.css';

const ManageNewTenant = () => {
  const [tenants, setTenants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch tenants from the backend using Axios
  useEffect(() => {
    axios.get('http://192.168.1.21/finalprojectv2/get_tenantsjs.php')
      .then((response) => {
        if (response.data.status === 'success') {
          setTenants(response.data.tenants);  // Assuming the response contains the tenants
        } else {
          alert('Failed to fetch tenants');
        }
      })
      .catch((error) => {
        console.error('Error fetching tenants:', error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const filteredTenants = tenants.filter((tenant) =>
    tenant.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.mobile_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteTenant = (id) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      axios.delete(`http://your-server-url/delete_tenant.php?id=${id}`)
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
      <h2>Manage New Tenant</h2>
      <div className="table-container">
        <div className="table-controls">
          <button onClick={() => navigate('/add_tenant')} className="add-button">Add New Tenant</button>
          <input
            type="text"
            id="searchBar"
            placeholder="Search Tenants"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <table id="tenantsTable">
          <thead>
            <tr>
              <th>ID#</th>
              <th>Full Name</th>
              <th>Gender</th>
              <th>Mobile Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.length > 0 ? (
              filteredTenants.map((tenant, index) => (
                <tr key={tenant.id}>
                  <td>{index + 1}</td>
                  <td>{tenant.full_name}</td>
                  <td>{tenant.gender}</td>
                  <td>{tenant.mobile_number}</td>
                  <td>
                    <button
                      className="manage_btn"
                      onClick={() => navigate(`/assign_tenant?id=${tenant.id}`)}
                    >
                      Assign
                    </button>
                    <button
                      className="edit_btn"
                      onClick={() => navigate(`/edit_tenant?id=${tenant.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete_btn"
                      onClick={() => handleDeleteTenant(tenant.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No tenants found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageNewTenant;
