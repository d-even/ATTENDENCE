import React from "react";
import { Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Navbar from "./components/Navbar"; // Ensure this is the correct component
import Student from "./components/Student/Student";
import Teacher from "./components/Teachers/Teacher";
import Admin from "./components/Admin";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navbar/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher-dashboard" element={<Teacher />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/student" element={<Student />} />
        <Route path="/teacher-signup" element={<Signup />} />
        <Route path="/teacher-login" element={<Login/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  );
}

export default App;
