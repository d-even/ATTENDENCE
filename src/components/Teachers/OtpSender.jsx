// import React from "react";
// import { useOtpContext } from "../context/OtpContext";

// const OtpSender = () => {
//   const { setOtp } = useOtpContext();

//   const generateOtp = () => {
//     const newOtp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
//     setOtp(newOtp);
//     localStorage.setItem("otp", newOtp); // ✅ Save OTP in localStorage
//     alert(`OTP Generated: ${newOtp}`);
//   };

//   const invalidateOtp = () => {
//     setOtp(""); // ✅ Clear OTP from context
//     localStorage.removeItem("otp"); // ✅ Remove OTP from localStorage
//     alert("OTP has been invalidated. It will no longer work.");
//   };

//   return (
//     // <div className="p-4 bg-white shadow rounded">
//     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//       <div className="flex items-center justify-between"></div>
//       <h2 className="text-lg font-semibold">Generate OTP</h2>
//       <button
//         onClick={generateOtp}
//         className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
//       >
//         Generate OTP
//       </button>
//       <button
//         onClick={invalidateOtp}
//         className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md ml-2"
//       >
//         Invalidate OTP
//       </button>
//     </div>

//   );
// };

// export default OtpSender;
import React, { useState } from "react";
import { useOtpContext } from "../context/OtpContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

const OtpSender = () => {
  const { setOtp } = useOtpContext();
  const [otpDocId, setOtpDocId] = useState(null); // Store Firestore doc ID

  const generateOtp = async () => {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      const docRef = await addDoc(collection(db, "otps"), {
        otp: newOtp,
        createdAt: serverTimestamp(),
      });

      setOtp(newOtp);
      setOtpDocId(docRef.id); // Store document ID for later deletion
      alert(`✅ OTP Generated and stored: ${newOtp}`);
    } catch (error) {
      console.error("❌ Error storing OTP in Firestore:", error);
      alert("Failed to store OTP. Try again.");
    }
  };

  const invalidateOtp = async () => {
    try {
      if (otpDocId) {
        await deleteDoc(doc(db, "otps", otpDocId));
        alert("❌ OTP has been invalidated");
      } else {
        alert("No active OTP found to invalidate.");
      }

      setOtp("");
      setOtpDocId(null);
    } catch (error) {
      console.error("Error deleting OTP:", error);
      alert("Failed to delete OTP.");
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <h2 className="text-lg font-semibold">Generate OTP</h2>
      <button
        onClick={generateOtp}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Generate OTP
      </button>
      <button
        onClick={invalidateOtp}
        className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md ml-2"
      >
        Invalidate OTP
      </button>
    </div>
  );
};

export default OtpSender;
