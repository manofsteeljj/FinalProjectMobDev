import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const EditTenant = () => {
  const { id } = useParams(); // Extract ID from route parameters
  const navigate = useNavigate();

  const [tenant, setTenant] = useState({
    full_name: '',
    gender: '',
    mobile_number: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log('Fetching tenant with ID:', id); // Debug log
      setLoading(true);
      axios
        .get(`http://192.168.1.21/finalprojectv2/get_tenant.php?id=${id}`)
        .then((response) => {
          if (response.data.status === 'success') {
            setTenant(response.data.tenant);
          } else {
            setError(response.data.message || 'Tenant not found');
          }
        })
        .catch((error) => {
          setError('Error fetching tenant data.');
          console.error('Error:', error);
        })
        .finally(() => setLoading(false));
    } else {
      setError('No tenant ID provided.');
      setLoading(false);
    }
  }, [id]);

  const updateTenant = async (e) => {
    e.preventDefault(); // Prevent default form submission

    console.log('Sending data:', tenant); // Debug log to check tenant data before sending it

    try {
        const response = await axios.put(`http://192.168.1.21/finalprojectv2/update_tenant.php`, {
            id: id, // Use ID from the URL parameter
            full_name: tenant.full_name, // Form data
            gender: tenant.gender, // Form data
            mobile_number: tenant.mobile_number, // Form data
        });

        if (response.data.status === 'success') {
            console.log('Tenant updated successfully!');
            // Redirect or show success message after successful update
            navigate(`/manage_new_tenant`); // Redirect to tenant detail page or wherever needed
        } else {
            console.error('Failed to update tenant:', response.data.message);
            setError(response.data.message || 'Error updating tenant');
        }
    } catch (error) {
        console.error('Error updating tenant:', error);
        setError('Error updating tenant');
    }
};


  const handleChange = (e) => {
    setTenant({ ...tenant, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <div className={`sidebar`}>
        <div className="logo-container">
          <img src="./img/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><a href="/dashboard" className="active">Manage Rooms</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>
      <h2>Edit Tenant</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={updateTenant}>
        <label htmlFor="full_name">Full Name:</label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={tenant.full_name}
          onChange={handleChange}
          required
        />
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          name="gender"
          value={tenant.gender}
          onChange={handleChange}
          required
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <label htmlFor="mobile_number">Mobile Number:</label>
        <input
          type="text"
          id="mobile_number"
          name="mobile_number"
          value={tenant.mobile_number}
          onChange={handleChange}
          required
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditTenant;
