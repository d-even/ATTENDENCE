const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "devensawant4554@gmail.com", // Replace with your Gmail
    pass: "jxml tqpr zsmc wotc", // Use an App Password, not your actual Gmail password
  },
});

// Endpoint to send OTP via email
app.post("/send-otp", async (req, res) => {
  const { email, otp } = req.body;

  const mailOptions = {
    from: "youremail",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP Code is: ${otp}. It is valid for 30 sec.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP Sent!" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});  