import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import OtpSender from "./OtpSender";
import CreateTimetable from "./CreateTimetable";

const Teacher = () => {
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      const teacherRef = doc(db, "teachers", currentUser.uid);
      const teacherSnap = await getDoc(teacherRef);

      if (teacherSnap.exists()) {
        setTeacher(teacherSnap.data());
      } else {
        navigate("/login") ;
      }
    };

    const fetchAttendance = async () => {
      const attendanceSnap = await getDocs(collection(db, "attendance"));
      setAttendance(attendanceSnap.docs.map((doc) => doc.data()));
    };

    const fetchAssignments = async () => {
      const assignmentSnap = await getDocs(collection(db, "assignments"));
      setAssignments(assignmentSnap.docs.map((doc) => doc.data()));
    };

    const fetchLectures = async () => {
      const lectureSnap = await getDocs(collection(db, "lectures"));
      setLectures(lectureSnap.docs.map((doc) => doc.data()));
    };

    fetchTeacherData();
    fetchAttendance();
    fetchAssignments();
    fetchLectures();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center">👨‍🏫 Teacher Dashboard</h2>
      {teacher && (
        <p className="text-lg text-gray-600 text-center mt-2">Welcome, {teacher.name}!</p>
      )}



<OtpSender/>

<CreateTimetable/>





      {/* ✅ View Class Attendance */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold">📊 Class Attendance</h3>
        {attendance.length > 0 ? (
          <ul className="list-disc ml-5 mt-2">
            {attendance.map((att, index) => (
              <li key={index}>📌 {att.studentName} - {att.status}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No attendance records available.</p>
        )}
      </div>

      {/* ✅ Manage Assignments */}
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold">📝 Manage Assignments</h3>
        {assignments.length > 0 ? (
          <ul className="list-disc ml-5 mt-2">
            {assignments.map((assignment, index) => (
              <li key={index}>📄 {assignment.title} - Due: {assignment.dueDate}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No assignments available.</p>
        )}
      </div>

      {/* ✅ Schedule Lectures
      <div className="mt-6 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-bold">📅 Scheduled Lectures</h3>
        {lectures.length > 0 ? (
          <ul className="list-disc ml-5 mt-2">
            {lectures.map((lecture, index) => (
              <li key={index}>📅 {lecture.topic} - {lecture.date}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No lectures scheduled.</p>
        )}
      </div> */}

      <button
        onClick={() => auth.signOut().then(() => navigate("/login"))}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Teacher;
