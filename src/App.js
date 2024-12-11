import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';  // Correct path to Login
import Dashboard from './pages/Dashboard';  // Correct path to Dashboard
import AddRoom from "./pages/AddRoom";
import RoomManage from './pages/RoomManage';
import EditRoom from './pages/EditRoom';
import ManageNewTenant from "./pages/ManageNewTenant"
import AssignTenant from './pages/AssignTenant';
import AddTenant from './pages/AddTenant';
import EditTenant from './pages/EditTenant';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add_room" element={<AddRoom />} />
        <Route path="/manage_room" element={<RoomManage />} />
        <Route path='/edit_room' element={<EditRoom/>} />
        <Route path='/manage_new_tenant' element={<ManageNewTenant/>} />
        <Route path='/assign_tenant' element={<AssignTenant/>} />
        <Route path='/add_tenant' element={<AddTenant/>} />
        <Route path="/edit-tenant/:id" element={<EditTenant />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;