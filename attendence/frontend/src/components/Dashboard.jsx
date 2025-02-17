import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Teacher from "./Teachers/Teacher";
import Student from "./Student/Student";
const Dashboard = () => {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      const teacherRef = doc(db, "teachers", currentUser.uid);
      const studentRef = doc(db, "students", currentUser.uid);

      const teacherSnap = await getDoc(teacherRef);
      const studentSnap = await getDoc(studentRef);

      if (teacherSnap.exists()) {
        setRole("teacher");
      } else if (studentSnap.exists()) {
        setRole("student");
      }
    };

    fetchUserRole();
  }, [navigate]);


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome to Dashboard</h2>
      <p className="text-lg text-gray-600 text-center mt-2">
        {role === "teacher" ? " Teacher Dashboard" : "Student Dashboard"}
      </p>

      {role === "teacher" && (
        <Teacher/>
        // <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        //   <h3 className="text-xl font-bold">Teacher Panel</h3>
        //   <ul className="list-disc ml-5 mt-2">
        //     <li>View Class Attendance</li>
        //     <li> Manage Assignments</li>
        //     <li> Schedule Lectures</li>
        //   </ul>
        // </div>
      )}

      {role === "student" && (
        <Student/>
        // <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        //   <h3 className="text-xl font-bold">Student Panel</h3>
        //   <ul className="list-disc ml-5 mt-2">
        //     <li> View Attendance</li>
        //     <li> Submit Assignments</li>
        //     <li> Join Live Classes</li>
        //   </ul>
        // </div>
      )}

      <button
        onClick={() => auth.signOut().then(() => navigate("/login"))}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
