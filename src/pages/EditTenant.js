import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const EditTenant = () => {
  const { id } = useParams();  // This gets the ID from the URL
  const navigate = useNavigate();

  const [tenant, setTenant] = useState({
    full_name: '',
    gender: '',
    mobile_number: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch tenant details based on the ID
  useEffect(() => {
    if (!id) {
      setError('Invalid tenant ID');
      setLoading(false);
      return;
    }

    axios
      .get(`http://192.168.1.21/finalprojectv2/get_tenant.php?id=${id}`)
      .then((response) => {
        if (response.data.status === 'success') {
          setTenant(response.data.tenant);
        } else {
          setError('Tenant not found');
        }
      })
      .catch(() => {
        setError('An unexpected error occurred.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Handle form submission to update tenant
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post('http://192.168.1.21/finalprojectv2/edit_tenantjs.php', {
        id: tenant.id,
        full_name: tenant.full_name,
        gender: tenant.gender,
        mobile_number: tenant.mobile_number,
      })
      .then((response) => {
        if (response.data.status === 'success') {
          navigate('/manage_new_tenant'); // Redirect after successful edit
        } else {
          setError('Error updating tenant');
        }
      })
      .catch(() => {
        setError('An unexpected error occurred.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    setTenant({
      ...tenant,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <h2>Edit Tenant</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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

        <button type="submit" disabled={loading}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditTenant;
