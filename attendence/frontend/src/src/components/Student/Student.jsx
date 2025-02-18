import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Timetable from "./Timetable";
import OtpInput from "./OtpInput";

function Student() {
  const [isApproved, setIsApproved] = useState(false);
  const [student, setStudent] = useState(null); // To store student data
  const [loading, setLoading] = useState(true); // Loading state to handle UI during initial fetch
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const q = query(
      collection(db, "pending_students"),
      where("email", "==", user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))[0]; // Assuming the first match is the student
      setStudent(studentData);
      setIsApproved(studentData?.approved); // Check approval status
      setLoading(false); // Set loading to false once we finish fetching the approval status
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>; // Show loading message while checking approval
  }

  if (isApproved) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-red-500">Access Denied. Waiting for Admin Approval.</h2>
        <p>Please check back later.</p>
      </div>
    );
  }

  return (
    <>
      {student && (
        <p className="text-lg text-gray-600 text-center mt-2">
          Welcome, {student.name}!
        </p>
      )}
      <OtpInput />
      <Timetable />
      <button
        onClick={() => auth.signOut().then(() => navigate("/login"))}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </>
  );
}

export default Student;
