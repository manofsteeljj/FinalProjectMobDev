import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import './Dashboard.css';



const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarActive, setSidebarActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user_id")) {
      navigate("/login");
    }

    fetch("http://192.168.1.2/finalprojectv2/get_rooms.php")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          setRooms(data.data || []);
        } else {
          console.error("Error fetching rooms:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching rooms:", error));
  }, [navigate]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      fetch(`http://192.168.1.2/finalprojectv2/delete_room.php?id=${id}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "success") {
            setRooms(rooms.filter((room) => room.id !== id));
          } else {
            alert("Error deleting room");
          }
        })
        .catch((error) => console.error("Error deleting room:", error));
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
          <li><a href="/dashboard" className="active">Manage Rooms</a></li>
          <li><a href="/manage_new_tenant">Manage New Tenant</a></li>
          <li><a href="/manage_tenants">Manage Tenants</a></li>
          <li><a href="/manage_facilities">Manage Facilities</a></li>
          <li><a href="/logout">Logout</a></li>
        </ul>
      </div>

      <div className="tap-area" onClick={toggleSidebar}></div>

      <div className="content">
        <h2>Manage Rooms</h2>
        <div className="table-container">
          <div className="table-controls">
            <button
              className="add-button"
              onClick={() => navigate("/add_room")}
            >
              Add New Room
            </button>
            <input
              type="text"
              id="searchBar"
              placeholder="Search Rooms"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <table id="roomsTable">
            <thead>
              <tr>
                <th>ID#</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Total Slots</th>
                <th>Remaining Slots</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms
                .filter((room) =>
                  room.room_number.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((room, index) => (
                  <tr key={room.id}>
                    <td>{index + 1}</td>
                    <td>{room.room_number}</td>
                    <td>{room.room_type}</td>
                    <td>{room.total_slots}</td>
                    <td>{room.remaining_slots}</td>
                    <td>
                      <button
                        className="manage_btn"
                        onClick={() => navigate(`/manage_room?id=${room.id}`)}
                      >
                        Manage
                      </button>
                      <button
                        className="edit_btn"
                        onClick={() => navigate(`/edit_room/${room.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete_btn"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
