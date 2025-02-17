import { useState } from "react";

function OtpSender() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function sendOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

    try {
      const response = await fetch("http://localhost:5000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Failed to send OTP");
    }
  }

  return (
    <div>
      <h2>Enter Your Email to Receive OTP</h2>
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={sendOtp}>Send OTP</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default OtpSender;
