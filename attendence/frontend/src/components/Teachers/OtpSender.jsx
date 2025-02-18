import React, { useState, useEffect } from "react";

const OtpSender = () => {
  const [otp, setOtp] = useState(null);
  const [timer, setTimer] = useState(10); // OTP validity time in seconds
  const [isOtpValid, setIsOtpValid] = useState(true); // Track if OTP is valid or expired

  // Generate a random 6-digit OTP
  const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
    setOtp(otp);
    setTimer(10); // Reset the timer each time a new OTP is generated
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
    <div className="otp-generator-container" style={{ textAlign: "center", padding: "20px" }}>
      <h2>Generate OTP</h2>
      <div className="otp-box" style={{ fontSize: "2em", margin: "20px" }}>
        {otp ? otp : "Click 'Generate OTP'"}
      </div>

      <div>
        {isOtpValid ? (
          <p>OTP expires in: {timer} seconds</p>
        ) : (
          <p style={{ color: "red" }}>OTP Expired!</p>
        )}
      </div>

      <button
        onClick={generateOtp}
        disabled={isOtpValid}
        style={{
          padding: "10px 20px",
          backgroundColor: isOtpValid ? "gray" : "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isOtpValid ? "Generate OTP" : "Generate New OTP"}
      </button>


    </div>
  );
};

export default OtpSender;

