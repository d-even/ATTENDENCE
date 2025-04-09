import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Timetable from "./Timetable";
import OtpInput from "./OtpInput";

function Student() {
  const [isApproved, setIsApproved] = useState(false);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        console.error("User is not logged in. Redirecting to login...");
        navigate("/login");
        return;
      }

      console.log("✅ User is logged in:", currentUser.email);

      const studentRef = doc(db, "students", currentUser.uid);
      try {
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const studentData = studentSnap.data();
          setStudent(studentData);
          setIsApproved(studentData.approved || false);
          console.log("🎓 Student name:", studentData.name); // ✅ Safe here
        } else {
          console.error("❌ Student document not found!");
        }
      } catch (error) {
        console.error("🔥 Error fetching student data:", error);
      }

      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return <h2 className="text-center mt-10">Loading...</h2>;
  }

  if (!isApproved) {
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
