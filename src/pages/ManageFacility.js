import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ManageFacility = () => {
  const [facilities, setFacilities] = useState([]); // Ensure it's an empty array initially
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  useEffect(() => {
    // Fetch facilities from the server
    const fetchFacilities = async () => {
        try {
          const response = await fetch('http://192.168.1.2/finalprojectv2/get_facilities.php');
          const data = await response.json();
          console.log('API Response:', data);  // Check the API response
      
          if (data.status === 'success' && Array.isArray(data.facilities)) {
            setFacilities(data.facilities);  // Use facilities, not tenants
          } else {
            console.error('Failed to fetch facilities');
          }
        } catch (error) {
          console.error('Error fetching facilities:', error);
        } finally {
          setLoading(false);
        }
      };
      

    fetchFacilities();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      // Make a request to delete the facility
      fetch(`http://192.168.1.2/finalprojectv2/delete_facilityjs.php?id=${id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            // Remove the deleted facility from the state
            setFacilities(facilities.filter((facility) => facility.id !== id));
          } else {
            alert('Error deleting facility');
          }
        })
        .catch((error) => {
          console.error('Error deleting facility:', error);
        });
    }
  };

  const filteredFacilities = (facilities || []).filter((facility) =>
    facility.equipment_type.toLowerCase().includes(searchTerm) ||
    facility.description.toLowerCase().includes(searchTerm) ||
    facility.status.toLowerCase().includes(searchTerm)
  );

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
      <h2>Manage Facilities</h2>
      <div className="table-container">
        <div className="table-controls">
          <button
            onClick={() => window.location.href = '/add_new_facility'}
            className="add-button"
          >
            Add New Facility
          </button>
          <input
            type="text"
            id="searchBar"
            placeholder="Search Facilities"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {loading ? (
          <div>Loading facilities...</div>
        ) : (
          <table id="facilitiesTable">
            <thead>
              <tr>
                <th>ID#</th>
                <th>Equipment Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.length > 0 ? (
                filteredFacilities.map((facility, index) => (
                  <tr key={facility.id}>
                    <td>{index + 1}</td>
                    <td>{facility.equipment_type}</td>
                    <td>{facility.description}</td>
                    <td>{facility.status}</td>
                    <td>
                      <button
                        className="edit_btn"
                        onClick={() => navigate(`/edit_facility/${facility.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete_btn"
                        onClick={() => handleDelete(facility.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5">No facilities found</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageFacility;
