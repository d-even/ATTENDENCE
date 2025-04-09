import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [latestOtpLecture, setLatestOtpLecture] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const q = query(collection(db, "attendance"), orderBy("time", "desc"));
        const querySnapshot = await getDocs(q);

        const studentData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    const fetchLatestOtp = async () => {
      const q = query(collection(db, "otps"), orderBy("createdAt", "desc"), limit(1));
      const snapshot = await getDocs(q);
      const latest = snapshot.docs[0]?.data();
      setLatestOtpLecture(latest || null);
    };

    fetchAttendance();
    fetchLatestOtp();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();

    if (latestOtpLecture) {
      doc.text(
        `Lecture: ${latestOtpLecture.subject} (${latestOtpLecture.time}) - ${latestOtpLecture.day}`,
        10,
        10
      );
    } else {
      doc.text("Attendance Report", 10, 10);
    }

    autoTable(doc, {
      startY: 20,
      head: [["Email", "Time"]],
      body: students.map((student) => [
        student.username,
        new Date(student.time?.seconds * 1000).toLocaleString(),
      ]),
    });

    doc.save("attendance_report.pdf");
  };

  const deleteAllAttendance = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "attendance"));
      querySnapshot.forEach(async (docItem) => {
        await deleteDoc(doc(db, "attendance", docItem.id));
      });

      setStudents([]);
      alert("All attendance records deleted!");
    } catch (error) {
      console.error("Error deleting records:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center">Attendance</h2>

      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Email</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.username}</td>
              <td>{new Date(student.time?.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={downloadPDF}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Download PDF
      </button>

      <button
        onClick={deleteAllAttendance}
        className="bg-red-500 text-white px-4 py-2 rounded ml-2 mt-4"
      >
        Delete All
      </button>
    </div>
  );
};

export default Attendance;

