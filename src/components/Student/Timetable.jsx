import React, { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";

function Timetable() {
  const [timetable, setTimetable] = useState([]);

  // Fetch Timetable from Firestore
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const timetableRef = collection(db, "timetable");
        const timetableSnapshot = await getDocs(timetableRef);
        const timetableData = timetableSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTimetable(timetableData);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center">📅 Class Timetable</h2>
      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Subject</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((lecture) => (
            <tr key={lecture.id} className="border">
              <td className="border p-2">{lecture.subject}</td>
              <td className="border p-2">{lecture.time}</td>
              <td className="border p-2">{lecture.teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Timetable;