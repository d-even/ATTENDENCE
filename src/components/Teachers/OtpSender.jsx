import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const OtpSender = () => {
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState(""); // 🆕 Track OTP document ID
  const [timetable, setTimetable] = useState([]);
  const [lectureId, setLectureId] = useState("");

  // ✅ Fetch timetable for dropdown
  useEffect(() => {
    const fetchTimetable = async () => {
      const querySnapshot = await getDocs(collection(db, "timetable"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTimetable(data);
    };

    fetchTimetable();
  }, []);

  // ✅ Generate OTP
  const generateOtp = async () => {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const selectedLecture = timetable.find((lec) => lec.id === lectureId);
    if (!selectedLecture) {
      alert("Please select a valid lecture.");
      return;
    }

    const docRef = await addDoc(collection(db, "otps"), {
      otp: otpCode,
      lectureId,
      subject: selectedLecture.subject,
      time: selectedLecture.time,
      day: selectedLecture.day,
      createdAt: new Date(),
      viewed: false,
    });

    setOtp(otpCode);
    setOtpId(docRef.id); // 🆕 Save the doc ID
  };

  // ❌ Invalidate OTP
  const invalidateOtp = async () => {
    if (!otpId) return;

    try {
      const otpRef = doc(db, "otps", otpId);
      await updateDoc(otpRef, { viewed: true });
      alert("OTP invalidated.");
      setOtp(""); // Clear OTP
      setOtpId(""); // Clear doc ID
    } catch (err) {
      console.error("Failed to invalidate OTP:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md mt-4">
      <h3 className="text-xl font-bold mb-2">Generate OTP for Lecture</h3>

      <select
        value={lectureId}
        onChange={(e) => setLectureId(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Select Lecture</option>
        {timetable.map((lec) => (
          <option key={lec.id} value={lec.id}>
            {lec.subject} - {lec.time} ({lec.day})
          </option>
        ))}
      </select>

      <button
        onClick={generateOtp}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
      >
        Generate OTP
      </button>

      {otp && (
        <div className="mt-4 text-lg font-semibold text-blue-700">
          OTP: {otp}
          <button
            onClick={invalidateOtp}
            className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Invalidate OTP
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpSender;
