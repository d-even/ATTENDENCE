import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase";
import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const OtpInput = () => {
  const [enteredOtp, setEnteredOtp] = useState(["", "", "", "", "", ""]);
  const [latestOtp, setLatestOtp] = useState(null);
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  // Fetch latest OTP from Firestore on load
  useEffect(() => {
    const fetchLatestOtp = async () => {
      const otpQuery = query(
        collection(db, "otps"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const querySnapshot = await getDocs(otpQuery);
      if (!querySnapshot.empty) {
        const otpData = querySnapshot.docs[0].data();
        setLatestOtp(otpData.otp);
      } else {
        console.warn("⚠️ No OTP found in Firestore.");
      }
    };

    fetchLatestOtp();
  }, []);

  // Handle input change per digit
  const handleChange = (value, index) => {
    const updatedOtp = [...enteredOtp];
    updatedOtp[index] = value;
    setEnteredOtp(updatedOtp);

    // Move to next input automatically
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Handle backspace to focus previous input
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !enteredOtp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    const otpEntered = enteredOtp.join("");

    if (!latestOtp) {
      alert("No OTP available. Please ask your teacher to generate one.");
      return;
    }

    if (otpEntered === latestOtp) {
      alert("✅ OTP Verified Successfully!");

      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, "attendance"), {
            username: user.displayName || user.email,
            time: serverTimestamp(),
          });

          navigate("/student");
        } catch (error) {
          console.error("Error saving attendance:", error);
        }
      }
    } else {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded text-center">
      <h2 className="text-lg font-semibold mb-4">Enter 6-Digit OTP</h2>
      <div className="flex justify-center gap-2 mb-4">
        {enteredOtp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Verify OTP
      </button>
    </div>
  );
};

export default OtpInput;



// import React, { useRef, useState } from "react";
// import { useOtpContext } from "../context/OtpContext";
// import { db, auth } from "../firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const OtpInput = () => {
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const inputsRef = useRef([]);
//   const navigate = useNavigate();

//   const handleChange = (value, index) => {
//     if (/^[0-9]?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 5) {
//         inputsRef.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputsRef.current[index - 1].focus();
//     }
//   };

//   const handleSubmit = async () => {
//     const enteredOtp = otp.join("");
//     const storedOtp = localStorage.getItem("otp");

//     if (!storedOtp || storedOtp === "") {
//       alert("OTP is invalid. Please generate a new OTP.");
//     } else if (enteredOtp === storedOtp) {
//       alert("OTP Verified Successfully!");

//       const user = auth.currentUser;
//       if (user) {
//         try {
//           await addDoc(collection(db, "attendance"), {
//             username: user.displayName || user.email,
//             time: serverTimestamp(),
//           });

//           navigate("/student");
//         } catch (error) {
//           console.error("Error saving attendance:", error);
//         }
//       }
//     } else {
//       alert("Invalid OTP. Try Again.");
//     }
//   };

//   return (
//     <div className="p-4 bg-white shadow rounded text-center">
//       <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>
//       <div className="flex justify-center gap-2 mb-4">
//         {otp.map((digit, index) => (
//           <input
//             key={index}
//             type="text"
//             maxLength="1"
//             value={digit}
//             ref={(el) => (inputsRef.current[index] = el)}
//             onChange={(e) => handleChange(e.target.value, index)}
//             onKeyDown={(e) => handleKeyDown(e, index)}
//             className="w-10 h-12 text-center text-xl border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         ))}
//       </div>
//       <button
//         onClick={handleSubmit}
//         className="mt-2 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
//       >
//         Verify OTP
//       </button>
//     </div>
//   );
// };

// export default OtpInput;
