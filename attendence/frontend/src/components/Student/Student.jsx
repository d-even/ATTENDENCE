import React, { useState, useRef } from "react";

// OTP Component
function OtpInput({ length = 6, onVerify }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  // Handle input change
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return; // Only allow numbers

    let newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); // Allow only 1 digit
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onVerify(newOtp.join(""));
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 mt-5">
      {otp.map((_, index) => (
        <input
          key={index}
          type="text"
          className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
          value={otp[index]}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => (inputRefs.current[index] = el)}
          maxLength={1}
        />
      ))}
    </div>
  );
}

// Student Component
function Student() {
  const [serverOtp, setServerOtp] = useState("123456"); // 🔥 Simulating OTP received from the server
  const [verificationStatus, setVerificationStatus] = useState(""); // State to store verification status

  const handleVerify = (enteredOtp) => {
    if (enteredOtp === serverOtp) {
      setVerificationStatus(" OTP Verified Successfully!");
      alert("OTP Verified Successfully!");
    } else {
      setVerificationStatus(" OTP Verification Failed! Try Again.");
      alert(" OTP Verification Failed! Try Again.");
    }
  };

  return (
    <>
      {/* Header Section */}
      <div>
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome Name
            </h1>
          </div>
        </header>
      </div>

      {/* Current Lecture Section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Current Lecture</h1>
      </div>

      {/* OTP Section */}
      <OtpInput length={6} onVerify={handleVerify} />

      {/* OTP Verification Message */}
      {verificationStatus && (
        <p className="text-center mt-4 font-semibold text-lg">{verificationStatus}</p>
      )}

      {/* Recent Attendance Section */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recent Attendance Present</h1>
      </div>
    </>
  );
}

export default Student;