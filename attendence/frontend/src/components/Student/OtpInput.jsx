import React, { useState, useEffect } from "react";

const OtpInput = () => {
  const [otp, setOtp] = useState(null);
  const [timer, setTimer] = useState(60); // OTP validity time in seconds
  const [isOtpValid, setIsOtpValid] = useState(true); // Track if OTP is valid or expired

  // Generate a random 6-digit OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    setOtp(otp);
    setTimer(60); // Reset the timer each time a new OTP is generated
    setIsOtpValid(true); // Reset OTP validity
  };

  // Timer to countdown OTP validity
  useEffect(() => {
    if (timer === 0) {
      setIsOtpValid(false); // OTP expired
      return;
    }

    const timerInterval = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup timer on component unmount
  }, [timer]);

  return (
    <div class="flex mb-3">
    <button class="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-l-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" type="button">
      Button
    </button>
    <input type="text" class="form-input border border-gray-300 px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Example text with button addon" aria-label="Example text with button addon"/>
  </div>
  
  );
};

export default OtpInput;


















// import React, { useState, useRef } from "react";

// function OtpInput({ length = 6, serverOtp = "123456", onVerify }) {
//   const [otp, setOtp] = useState(new Array(length).fill(""));
//   const inputRefs = useRef([]);
//   const [verificationStatus, setVerificationStatus] = useState("");

//   // Handle input change
//   const handleChange = (index, e) => {
//     const value = e.target.value;
//     if (isNaN(value)) return; // Only allow numbers

//     let newOtp = [...otp];
//     newOtp[index] = value.substring(value.length - 1); // Allow only 1 digit
//     setOtp(newOtp);

//     // Move to next input
//     if (value && index < length - 1) {
//       inputRefs.current[index + 1].focus();
//     }

//     // If all fields are filled, trigger verification
//     if (newOtp.every((digit) => digit !== "")) {
//       handleVerify(newOtp.join(""));
//     }
//   };

//   // Handle Backspace
//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   // Handle OTP Verification
//   const handleVerify = (enteredOtp) => {
//     if (enteredOtp === serverOtp) {
//       setVerificationStatus("✅ OTP Verified Successfully!");
//       alert("OTP Verified Successfully!");
//       onVerify && onVerify(true); // Call the verification callback
//     } else {
//       setVerificationStatus("❌ OTP Verification Failed! Try Again.");
//       alert("OTP Verification Failed! Try Again.");
//       onVerify && onVerify(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-5">
//       <div className="flex justify-center gap-2">
//         {otp.map((_, index) => (
//           <input
//             key={index}
//             type="text"
//             className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
//             value={otp[index]}
//             onChange={(e) => handleChange(index, e)}
//             onKeyDown={(e) => handleKeyDown(index, e)}
//             ref={(el) => (inputRefs.current[index] = el)}
//             maxLength={1}
//           />
//         ))}
//       </div>

//       {/* OTP Verification Message */}
//       {verificationStatus && (
//         <p className="text-center mt-4 font-semibold text-lg">{verificationStatus}</p>
//       )}
//     </div>
//   );
// }

// export default OtpInput;
