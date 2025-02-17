import React from 'react'
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import OtpSender from "./OtpSender";


function Teacher() {
  
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate("/teacher-login");
  };

  return (
    <div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Mam</h1>
      </div>

      <OtpSender/>
      <button onClick={handleLogout}>Logout</button>
  
    </div>
  )
}

export default Teacher