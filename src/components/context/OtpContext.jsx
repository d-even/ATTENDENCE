import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const OtpContext = createContext();

export const OtpProvider = ({ children }) => {
  const [otp, setOtp] = useState(localStorage.getItem("otp") || ""); // ✅ Load OTP from localStorage
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  // Save OTP to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("otp", otp);
  }, [otp]);

  // Save username in localStorage
  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().name);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <OtpContext.Provider value={{ otp, setOtp, username, setUsername }}>
      {children}
    </OtpContext.Provider>
  );
};

// Hook to use Context
export const useOtpContext = () => useContext(OtpContext);
