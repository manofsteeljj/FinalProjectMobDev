import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import './Dashboard.css';

const RoomManage = () => {
  const [room, setRoom] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const roomId = queryParams.get("id");

  useEffect(() => {
    if (!localStorage.getItem("user_id")) {
      navigate("/login");
    }

    fetch(`http://192.168.1.21/finalprojectv2/get_room_details.php?id=${roomId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setRoom(data.room);
          setTenants(data.tenants || []);
        } else {
          console.error("Error fetching room details:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching room details:", error));
  }, [navigate, roomId]);

  const handleCheckoutTenant = (tenantId) => {
    if (window.confirm("Are you sure you want to check out this tenant?")) {
      fetch(`http://192.168.1.21/finalprojectv2/checkout_tenant.php?id=${tenantId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setTenants(tenants.filter((tenant) => tenant.id !== tenantId));
          } else {
            alert("Error checking out tenant");
          }
        })
        .catch((error) => console.error("Error checking out tenant:", error));
    }
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className={`dashboard-container ${sidebarActive ? 'sidebar-active' : ''}`}>
      <div className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <div className="logo-container">
          <img src="./img/Dorm.png" alt="Dormitory Logo" className="logo" />
          <h1>Dorm Management</h1>
        </div>
        <ul className="sidebar-menu">
          <li><a href="/dashboard">Manage Rooms</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      <div className="tap-area" onClick={toggleSidebar}></div>

      <div className="content">
        <button onClick={toggleSidebar} className="toggle-sidebar-btn">
          ☰
        </button>
        {room ? (
          <div>
            <h2>Manage Room: {room.room_number}</h2>
            <p><strong>Room Type:</strong> {room.room_type}</p>
            <p><strong>Total Slots:</strong> {room.total_slots}</p>
            <p><strong>Remaining Slots:</strong> {room.remaining_slots}</p>

            <h3>Tenants</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID#</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Contact#</th>
                    <th>Stay From</th>
                    <th>Stay To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id}>
                      <td>{tenant.id}</td>
                      <td>{tenant.full_name}</td>
                      <td>{tenant.gender}</td>
                      <td>{tenant.mobile_number}</td>
                      <td>{tenant.stay_from}</td>
                      <td>{tenant.stay_to}</td>
                      <td>
                        <button onClick={() => handleCheckoutTenant(tenant.id)}>Check Out</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>Loading room details...</p>
        )}
      </div>
    </div>
  );
};

export default RoomManage;
