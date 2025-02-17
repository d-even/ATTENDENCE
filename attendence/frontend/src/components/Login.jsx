import React, { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");  //  Store user's role
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check Firestore for role
      const teacherRef = doc(db, "teachers", user.uid);
      const studentRef = doc(db, "students", user.uid);

      const teacherSnap = await getDoc(teacherRef);
      const studentSnap = await getDoc(studentRef);

      if (teacherSnap.exists()) {
        setRole("teacher");
        navigate("/dashboard");
      } else if (studentSnap.exists()) {
        setRole("student");
        navigate("/dashboard");
      } else {
        setError("Access Denied! You are not registered as a teacher or student.");
      }
    } catch (err) {
      setError("Login failed! Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
          >
            Login
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Signup
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;









// import React, { useState } from "react";
// import { auth, db } from "../firebase";  // Ensure correct path
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       // Sign in user
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       // Check if user exists in Firestore under "students" collection
//       const studentRef = doc(db, "students", user.uid);
//       const studentSnap = await getDoc(studentRef);

//       if (studentSnap.exists()) {
//         navigate("/student");  // Redirect if student is found
//       } else {
//         setError("Access Denied! You are not registered as a student.");
//       }
//     } catch (err) {
//       setError("Login failed! Please check your credentials.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-center text-gray-800">Student Login</h2>
//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
//         <form onSubmit={handleLogin} className="mt-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Email</label>
//             <input
//               type="email"
//               className="w-full mt-1 p-2 border rounded-md"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mt-3">
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               className="w-full mt-1 p-2 border rounded-md"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full mt-4 p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-10 text-center text-sm/6 text-gray-500">
//               Not a member?{' '}
//               <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
//                Signup
//               </a>
//             </p>
//       </div>
//     </div>
//   );
// };

// export default Login;