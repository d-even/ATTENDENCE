import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import OtpSender from "./OtpSender";
import CreateTimetable from "./CreateTimetable";
import Attendence from "./Attendence";

const Teacher = () => {
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [lectures, setLectures] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch Teacher Info
  useEffect(() => {
    const fetchTeacherData = async () => {
      const user = auth.currentUser;
      if (user) {
        const teacherRef = doc(db, "teachers", user.uid);
        const teacherSnap = await getDoc(teacherRef);
        if (teacherSnap.exists()) {
          setTeacher(teacherSnap.data());
        }
      }
    };

    fetchTeacherData();
  }, []);

  // ✅ Fetch Attendance Data
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const attendanceSnap = await getDocs(collection(db, "attendance"));
        setAttendance(attendanceSnap.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendance();
  }, []);

  // ✅ Fetch Assignments Data
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentSnap = await getDocs(collection(db, "assignments"));
        setAssignments(assignmentSnap.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    };

    fetchAssignments();
  }, []);

  // ✅ Fetch Lectures Data
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const lectureSnap = await getDocs(collection(db, "lectures"));
        setLectures(lectureSnap.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        Hello {teacher ? teacher.name : "Teacher"}
      </h2>

      <OtpSender />
      <CreateTimetable />
      <Attendence />

      <button
        onClick={() => navigate("/login")}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Teacher;
