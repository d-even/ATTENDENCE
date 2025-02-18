// import React, { useState, useEffect } from "react";
// import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
// import { db } from "../firebase";

// function AdminDashboard() {
//   const [pendingUsers, setPendingUsers] = useState([]);
//   const [approvedUsers, setApprovedUsers] = useState([]);

//   // Fetch Pending Students from Firestore
//   useEffect(() => {
//     const unsubscribe = onSnapshot(collection(db, "pending_students"), (snapshot) => {
//       const students = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setPendingUsers(students);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Approve a Student
//   const approveUser = async (student) => {
//     try {
//       // Move student to approved_users collection
//       await updateDoc(doc(db, "pending_students", student.id), {
//         approved: true,
//       });

//       // Store in localStorage
//       const updatedApprovedUsers = [...approvedUsers, student.email];
//       setApprovedUsers(updatedApprovedUsers);
//       localStorage.setItem("approvedUsers", JSON.stringify(updatedApprovedUsers));

//       // Remove from pending list
//       await deleteDoc(doc(db, "pending_students", student.id));
//     } catch (error) {
//       console.error("Error approving user:", error);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h2 className="text-2xl font-bold text-center">AdminDashboard Panel</h2>

//       {/* Pending Users */}
//       <div className="mt-4">
//         <h3 className="text-lg font-semibold">Pending Approvals</h3>
//         {pendingUsers.length > 0 ? (
//           pendingUsers.map((student) => (
//             <div key={student.id} className="flex justify-between p-2 border mt-2">
//               <span>{student.email}</span>
//               <button
//                 onClick={() => approveUser(student)}
//                 className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
//               >
//                 Approve
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No pending users.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;









import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  // Fetch pending students from Firestore
  useEffect(() => {
    const fetchPendingUsers = async () => {
      const usersRef = collection(db, "pending_students");
      const snapshot = await getDocs(usersRef);
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPendingUsers(usersList);
    };

    fetchPendingUsers();
  }, []);

  // Approve User Function
  const approveUser = async (user) => {
    try {
      const { id, name, email, role } = user; 
      const targetCollection = role === "teacher" ? "teachers" : "students";

      // Move user to 'students' or 'teachers' collection and mark as approved
      await setDoc(doc(db, targetCollection, id), {
        uid: id,
        name,
        email,
        role,
        approved: true, // Ensure 'approved' is set to true when moved
      });

      // Remove user from "pending_students" collection
      await deleteDoc(doc(db, "pending_students", id));

      // Update UI by removing the user from pending list
      setPendingUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));

      alert(`${name} has been approved and moved to ${targetCollection}!`);
    } catch (error) {
      console.error("Error approving user:", error);
      alert("Failed to approve user. Try again.");
    }
  };

  // Reject User Function (if you want an option to reject as well)
  const rejectUser = async (user) => {
    try {
      const { id } = user;

      // Remove user from pending_students if rejected
      await deleteDoc(doc(db, "pending_students", id));

      // Update UI by removing the user from pending list
      setPendingUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));

      alert(`User has been rejected.`);
    } catch (error) {
      console.error("Error rejecting user:", error);
      alert("Failed to reject user. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center">Admin Dashboard - Approve Students & Teachers</h2>

      {/* Pending Users */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Pending Approvals</h3>
        {pendingUsers.length === 0 ? (
          <p>No pending users</p>
        ) : (
          <ul>
            {pendingUsers.map((user) => (
              <div key={user.id} className="flex justify-between p-2 border mt-2">
                <li>
                  {user.name} ({user.email}) - Role: {user.role}
                </li>

                <div>
                  <button
                    onClick={() => approveUser(user)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectUser(user)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
