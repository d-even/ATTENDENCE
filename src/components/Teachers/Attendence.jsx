import React, { useState, useEffect } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Corrected import

const Attendance = () => {
  const [students, setStudents] = useState([]);

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

    fetchAttendance();
  }, []);

  // ✅ Generate PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 10, 10);

    autoTable(doc, {
      head: [["Email", "Time"]],
      body: students.map((student) => [
        student.username,
        new Date(student.time?.seconds * 1000).toLocaleString(),
      ]),
    });

    doc.save("attendance_report.pdf"); // ✅ Save file
  };

  // ✅ Delete all records
  const deleteAllAttendance = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "attendance"));
      querySnapshot.forEach(async (docItem) => {
        await deleteDoc(doc(db, "attendance", docItem.id));
      });

      setStudents([]); // ✅ Clear state after deletion
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
      <button onClick={downloadPDF} className="bg-blue-500 text-white px-4 py-2 rounded">
        Download PDF
      </button>
      <button onClick={deleteAllAttendance} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
        Delete All
      </button>
    </div>
  );
};

export default Attendance;
