import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  // Correct path to Login
import Dashboard from './pages/Dashboard';  // Correct path to Dashboard
import AddRoom from "./pages/AddRoom";
import RoomManage from './pages/RoomManage';
import EditRoom from './pages/EditRoom';
import ManageNewTenant from "./pages/ManageNewTenant";
import AssignTenant from './pages/AssignTenant';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';
import ManageTenant from './pages/ManageTenant'
import ManageFacility from './pages/ManageFacility.js';
import AddFacility from './pages/AddFacility';
import EditFacility from './pages/EditFacility';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add_room" element={<AddRoom />} />
        <Route path="/manage_room" element={<RoomManage />} />
        <Route path="/edit_room" element={<EditRoom />} />
        <Route path="/manage_new_tenant" element={<ManageNewTenant />} />
        <Route path="/add_new_facility" element={<AddFacility />} />
        <Route path="/manage_facilities" element={<ManageFacility />} />
        <Route path="/manage_tenants" element={<ManageTenant />} />
        <Route path="/assign_tenant" element={<AssignTenant />} />
        <Route path="/add_tenant" element={<AddTenant />} />
        {/* Use dynamic routing for edit_tenant */}
        <Route path="/edit_tenant/:id" element={<EditTenant />} />
        <Route path="/edit_room/:id" element={<EditRoom />} />
        <Route path="/edit_facility/:id" element={<EditFacility />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
