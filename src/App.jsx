import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Student from "./components/Student/Student";
import Teacher from "./components/Teachers/Teacher";
import Admin from "./components/Admin/Admin";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";


function App() {
  return (
 
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/student" element={<Student />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
      </Routes>

  );
}

export default App;
