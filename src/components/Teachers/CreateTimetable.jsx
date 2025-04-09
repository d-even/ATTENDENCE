import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Firestore setup
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

const CreateTimetable = () => {
  const [subject, setSubject] = useState("");
  const [time, setTime] = useState("");
  const [day, setDay] = useState("Monday");
  const [timetable, setTimetable] = useState([]);
  // const[teacher,setTeacher]=useState("");


  useEffect(() => {
    fetchTimeTable();
  }, []);

  // 🔍 Fetch timetable from Firestore
  const fetchTimeTable = async () => {
    const querySnapshot = await getDocs(collection(db, "timetable"));
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setTimetable(data);
  };

  // ➕ Add a new lecture
  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!subject || !time ) return alert("All fields are required!");//|| !teacher

    await addDoc(collection(db, "timetable"), { subject, time, day });//teacher
    fetchTimeTable(); // Refresh timetable
    setSubject("");
    setTime("");
    // setTeacher("");
  };

  // ❌ Delete a lecture
  const handleDeleteLecture = async (id) => {
    await deleteDoc(doc(db, "timetable", id));
    fetchTimeTable(); // Refresh timetable
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center">📅 Time Table</h2>

      {/* ➕ Add Lecture Form */}
      <form onSubmit={handleAddLecture} className="bg-white p-4 rounded shadow-md mt-4">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Subject"
            className="border p-2 rounded w-1/3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <input
            type="time"
            placeholder="Time (e.g., 10:00 AM - 11:00 AM)"
            className="border p-2 rounded w-1/3"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          {/* <input
            type="text"
            placeholder="Teacher"
            className="border p-2 rounded w-1/3"
            value={teacher.name}
            // onChange={(e) => setTeacher(e.target.value)}
            required
          /> */}
          <select
            className="border p-2 rounded w-1/3"
            value={day}
            onChange={(e) => setDay(e.target.value)}
          >
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
        >
          ➕ Add Lecture
        </button>
      </form>

      {/* 📋 Display Timetable */}
      <div className="mt-6">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
          <div key={day} className="bg-white p-4 mt-4 rounded shadow-md">
            <h3 className="text-xl font-bold">{day}</h3>
            <ul>
              {timetable
                .filter((item) => item.day === day)
                .map((lecture) => (
                  <li key={lecture.id} className="flex justify-between mt-2">
                    <span>
                      📖 {lecture.subject} - ⏰ {lecture.time}
                    </span>
                    <button
                      onClick={() => handleDeleteLecture(lecture.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      ❌ Remove
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateTimetable;


