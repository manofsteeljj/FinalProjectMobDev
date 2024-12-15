import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

const EditFacility = () => {
  const { id } = useParams(); // Extract ID from route parameters
  const navigate = useNavigate();

  const [facility, setFacility] = useState({
    equipment_type: '',
    description: '',
    status: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log('Fetching facility with ID:', id); // Debug log
      setLoading(true);
      axios
        .get(`http://192.168.1.2/finalprojectv2/get_facility.php?id=${id}`)
        .then((response) => {
          if (response.data.status === 'success') {
            setFacility(response.data.facility);
          } else {
            setError(response.data.message || 'Facility not found');
          }
        })
        .catch((error) => {
          setError('Error fetching facility data.');
          console.error('Error:', error);
        })
        .finally(() => setLoading(false));
    } else {
      setError('No facility ID provided.');
      setLoading(false);
    }
  }, [id]);

  const updateFacility = async (e) => {
    e.preventDefault(); // Prevent default form submission

    console.log('Sending data:', facility); // Debug log to check facility data before sending it

    try {
      const response = await axios.post(
        `http://192.168.1.2/finalprojectv2/edit_facilityjs.php?id=${id}`,
        facility
      );

      if (response.data.status === 'success') {
        console.log('Facility updated successfully!');
        navigate(`/manage_facilities`); // Redirect to facilities page
      } else {
        console.error('Failed to update facility:', response.data.message);
        setError(response.data.message || 'Error updating facility');
      }
    } catch (error) {
      console.error('Error updating facility:', error);
      setError('Error updating facility');
    }
  };

  const handleChange = (e) => {
    setFacility({ ...facility, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content">
      <h2>Edit Facility</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={updateFacility}>
        <label htmlFor="equipment_type">Equipment Type:</label>
        <input
          type="text"
          id="equipment_type"
          name="equipment_type"
          value={facility.equipment_type}
          onChange={handleChange}
          required
        />
        <label htmlFor="description">Description (Model Name):</label>
        <input
          type="text"
          id="description"
          name="description"
          value={facility.description}
          onChange={handleChange}
          required
        />
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={facility.status}
          onChange={handleChange}
          required
        >
          <option value="Available">Available</option>
          <option value="Being Used">Being Used</option>
          <option value="Faulty">Faulty</option>
        </select>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditFacility;
