// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import Modal from "react-modal";
// // import {
// //   Box,
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   TablePagination,
// // } from '@mui/material';
// // import { FaArrowLeft } from 'react-icons/fa';
// // import "./ManageCoach.css";
// // import { Domain_URL } from "../../config";
// // import { useNavigate } from 'react-router-dom';

// // // Define interface for coach data
// // interface Coach {
// //   coachId: string;
// //   name: string;
// //   gender: 'male' | 'female' | 'other';
// //   email: string;
// //   emailVerified: boolean;
// //   age?: number | null;
// //   phoneNumber: string;
// //   profession: string;
// //   bio?: string | null;
// //   experience: string;
// //   pushNotificationEnabled: boolean;
// //   status: 'Active' | 'Inactive';
// //   softDelete: boolean; // added for soft delete flag
// // }

// // Modal.setAppElement('#root');

// // const ManageCoach: React.FC = () => {
// //   const [coaches, setCoaches] = useState<Coach[]>([]);
// //   const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
// //   // const [searchTerm, setSearchTerm] = useState('');
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
// //   const [isAddingCoach, setIsAddingCoach] = useState(false);

// //   const navigate = useNavigate();

// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);

// //   // Fetch data from the database when component mounts
// //   useEffect(() => {
// //     const fetchCoaches = async () => {
// //       try {
// //         const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
// //         if (Array.isArray(response.data)) {
// //           const sortedCoaches = response.data.sort((a: Coach, b: Coach) =>
// //             a.name.localeCompare(b.name)
// //           );
// //           setCoaches(sortedCoaches);
// //           setFilteredCoaches(sortedCoaches); // Set initial filtered coaches as sorted coaches
// //         } else {
// //           console.error("API did not return an array of coaches");
// //           setCoaches([]);
// //           setFilteredCoaches([]);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching coach data", error);
// //         setCoaches([]);
// //         setFilteredCoaches([]);
// //       }
// //     };

// //     fetchCoaches();
// //   }, []);

 

// //   const handleEdit = (coach: Coach) => {
// //     setCurrentCoach(coach);
// //     setIsModalOpen(true);
// //     setIsAddingCoach(false);
// //   };

  

// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
// //     if (currentCoach) {
// //       try {
// //         if (isAddingCoach) {
// //           const response = await axios.post(`${Domain_URL}/coach/add`, currentCoach);
// //           const updatedCoaches = [...coaches, response.data].sort((a, b) => a.name.localeCompare(b.name));
// //           setCoaches(updatedCoaches);
// //           setFilteredCoaches(updatedCoaches);
// //         } else {
// //           await axios.put(`${Domain_URL}/coach/update/${currentCoach.coachId}`, currentCoach);
// //           const updatedCoaches = coaches.map(coach => (coach.coachId === currentCoach.coachId ? currentCoach : coach)).sort((a, b) => a.name.localeCompare(b.name));
// //           setCoaches(updatedCoaches);
// //           setFilteredCoaches(updatedCoaches);
// //         }
// //         setIsModalOpen(false);
// //       } catch (error) {
// //         console.error(`Error ${isAddingCoach ? 'adding' : 'updating'} coach`, error);
// //       }
// //     }
// //   };

// //   const handleToggleSoftDelete = async (coach: Coach) => {
// //     try {
// //       const action = coach.softDelete ? 'restore' : 'delete';
// //       await axios.post(`${Domain_URL}/coach/coaches/manage/${coach.coachId}`, { action });

// //       const updatedCoaches = coaches.map(c =>
// //         c.coachId === coach.coachId ? { ...c, softDelete: !c.softDelete } : c
// //       ).sort((a, b) => a.name.localeCompare(b.name));
// //       setCoaches(updatedCoaches);
// //       setFilteredCoaches(updatedCoaches);
// //     } catch (error) {
// //       console.error("Error toggling coach status", error);
// //     }
// //   };

// //   const goBackToDashboard = () => {
// //     navigate('/dashboard');
// //   };

// //   const handleChangePage = (_event: unknown, newPage: number) => {
// //     setPage(newPage);
// //   };

// //   const paginatedCoaches = filteredCoaches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (currentCoach) {
// //       setCurrentCoach({
// //         ...currentCoach,
// //         [e.target.name]: e.target.value,
// //       });
// //     }
// //   };

// //   return (
// //     <div>
// //       <button onClick={goBackToDashboard} className="go-back-button">
// //         <FaArrowLeft /> Go Back to Dashboard
// //       </button>
// //       <h2>Manage Coach</h2>

// //       <Box sx={{ p: 2 }}>
        
// //       </Box>

// //       <TableContainer>
// //         <Table>
// //           <TableHead>
// //             <TableRow>
// //               <TableCell>Name</TableCell>
// //               <TableCell>Email</TableCell>
// //               <TableCell>Phone Number</TableCell>
// //               {/* <TableCell>Profession</TableCell> */}
// //               <TableCell>Status</TableCell>
// //               <TableCell>Actions</TableCell>
// //             </TableRow>
// //           </TableHead>
// //           <TableBody>
// //             {paginatedCoaches.map(coach => (
// //               <TableRow key={coach.coachId}>
// //                 <TableCell>{coach.name}</TableCell>
// //                 <TableCell>{coach.email}</TableCell>
// //                 <TableCell>{coach.phoneNumber}</TableCell>
// //                 {/* <TableCell>{coach.profession}</TableCell> */}
// //                 <TableCell>{coach.softDelete ? 'Inactive' : 'Active'}</TableCell>
// //                 <TableCell>
// //                   <button onClick={() => handleEdit(coach)}>Edit</button>
// //                   <button onClick={() => handleToggleSoftDelete(coach)}>
// //                     {coach.softDelete ? 'Undo Freeze' : 'Freeze Account'}
// //                   </button>
// //                 </TableCell>
// //               </TableRow>
// //             ))}
// //           </TableBody>
// //         </Table>
// //       </TableContainer>

// //       <TablePagination
// //         rowsPerPageOptions={[5, 10, 25]}
// //         component="div"
// //         count={filteredCoaches.length}
// //         rowsPerPage={rowsPerPage}
// //         page={page}
// //         onPageChange={handleChangePage}
// //         onRowsPerPageChange={(event) => {
// //           setRowsPerPage(parseInt(event.target.value, 10));
// //           setPage(0);
// //         }}
// //       />

// //       <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
// //         <h2>{isAddingCoach ? 'Add Coach' : 'Edit Coach'}</h2>
// //         <form onSubmit={handleSubmit}>
// //           <input type="text" name="name" placeholder="Name" value={currentCoach?.name || ''} onChange={handleInputChange} required />
// //           <input type="email" name="email" placeholder="Email" value={currentCoach?.email || ''} onChange={handleInputChange} required />
// //           <input type="text" name="phoneNumber" placeholder="Phone Number" value={currentCoach?.phoneNumber || ''} onChange={handleInputChange} required />
// //           <input type="text" name="profession" placeholder="Sport" value={currentCoach?.profession || ''} onChange={handleInputChange} required />
// //           <input type="text" name="bio" placeholder="Bio" value={currentCoach?.bio || ''} onChange={handleInputChange} />
          
// //           <button type="submit">{isAddingCoach ? 'Add Coach' : 'Update Coach'}</button>
// //           <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
// //         </form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default ManageCoach;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Modal from "react-modal";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
// } from "@mui/material";
// import { FaArrowLeft } from "react-icons/fa";
// import "./ManageCoach.css";
// import { Domain_URL } from "../../config";
// import { useNavigate } from "react-router-dom";

// // Define interface for coach data
// interface Coach {
//   coachId: string;
//   name: string;
//   gender: "male" | "female" | "other";
//   email: string;
//   emailVerified: boolean;
//   age?: number | null;
//   phoneNumber: string;
//   profession: string;
//   bio?: string | null;
//   experience: string;
//   pushNotificationEnabled: boolean;
//   status: "Active" | "Inactive";
//   softDelete: boolean; // added for soft delete flag
// }

// Modal.setAppElement("#root");

// const ManageCoach: React.FC = () => {
//   const [coaches, setCoaches] = useState<Coach[]>([]);
//   const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
//   const [isAddingCoach, setIsAddingCoach] = useState(false);

//   const [isMobileView, setIsMobileView] = useState(false); // Detect mobile view
//   const navigate = useNavigate();

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Detect window resize
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth <= 768);
//     };

//     window.addEventListener("resize", handleResize);
//     handleResize(); // Run on mount to check initial window size

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch data from the database when component mounts
//   useEffect(() => {
//     const fetchCoaches = async () => {
//       try {
//         const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
//         if (Array.isArray(response.data)) {
//           const sortedCoaches = response.data.sort((a: Coach, b: Coach) =>
//             a.name.localeCompare(b.name)
//           );
//           setCoaches(sortedCoaches);
//           setFilteredCoaches(sortedCoaches); // Set initial filtered coaches as sorted coaches
//         } else {
//           console.error("API did not return an array of coaches");
//           setCoaches([]);
//           setFilteredCoaches([]);
//         }
//       } catch (error) {
//         console.error("Error fetching coach data", error);
//         setCoaches([]);
//         setFilteredCoaches([]);
//       }
//     };

//     fetchCoaches();
//   }, []);

//   const handleEdit = (coach: Coach) => {
//     setCurrentCoach(coach);
//     setIsModalOpen(true);
//     setIsAddingCoach(false);
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (currentCoach) {
//       try {
//         if (isAddingCoach) {
//           const response = await axios.post(`${Domain_URL}/coach/add`, currentCoach);
//           const updatedCoaches = [...coaches, response.data].sort((a, b) => a.name.localeCompare(b.name));
//           setCoaches(updatedCoaches);
//           setFilteredCoaches(updatedCoaches);
//         } else {
//           await axios.put(`${Domain_URL}/coach/update/${currentCoach.coachId}`, currentCoach);
//           const updatedCoaches = coaches.map(coach => (coach.coachId === currentCoach.coachId ? currentCoach : coach)).sort((a, b) => a.name.localeCompare(b.name));
//           setCoaches(updatedCoaches);
//           setFilteredCoaches(updatedCoaches);
//         }
//         setIsModalOpen(false);
//       } catch (error) {
//         console.error(`Error ${isAddingCoach ? "adding" : "updating"} coach`, error);
//       }
//     }
//   };

//   const handleToggleSoftDelete = async (coach: Coach) => {
//     try {
//       const action = coach.softDelete ? "restore" : "delete";
//       await axios.patch(`${Domain_URL}/coach/coaches/manage/${coach.coachId}`, { action });

//       const updatedCoaches = coaches.map(c =>
//         c.coachId === coach.coachId ? { ...c, softDelete: !c.softDelete } : c
//       ).sort((a, b) => a.name.localeCompare(b.name));
//       setCoaches(updatedCoaches);
//       setFilteredCoaches(updatedCoaches);
//     } catch (error) {
//       console.error("Error toggling coach status", error);
//     }
//   };

//   const goBackToDashboard = () => {
//     navigate("/dashboard");
//   };

//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const paginatedCoaches = filteredCoaches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (currentCoach) {
//       setCurrentCoach({
//         ...currentCoach,
//         [e.target.name]: e.target.value,
//       });
//     }
//   };
//   return (
//     <div>
//       <button onClick={goBackToDashboard} className="go-back-button">
//         <FaArrowLeft /> Go Back to Dashboard
//       </button>
//       <h2>Manage Coach</h2>

//       <Box sx={{ p: 2 }}></Box>

//       {/* Conditional rendering: table or cards based on screen size */}
//       {isMobileView ? (
//         <div className="card-container">
//           {paginatedCoaches.map((coach) => (
//             <div className="coach-card" key={coach.coachId}>
//               <h3>{coach.name}</h3>
//               <p>Email: {coach.email}</p>
//               <p>Phone: {coach.phoneNumber}</p>
//               <p>Status: {coach.softDelete ? "Inactive" : "Active"}</p>
//               <div className="action-buttons">
//                 <button onClick={() => handleEdit(coach)}>Edit</button>
//                 <button onClick={() => handleToggleSoftDelete(coach)}>
//                   {coach.softDelete ? "Undo Freeze" : "Freeze Account"}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <TableContainer>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>Name</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Phone Number</TableCell>
//                 <TableCell>Status</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {paginatedCoaches.map((coach) => (
//                 <TableRow key={coach.coachId}>
//                   <TableCell>{coach.name}</TableCell>
//                   <TableCell>{coach.email}</TableCell>
//                   <TableCell>{coach.phoneNumber}</TableCell>
//                   <TableCell>{coach.softDelete ? "Inactive" : "Active"}</TableCell>
//                   <TableCell>
//                     <button onClick={() => handleEdit(coach)}>Edit</button>
//                     <button onClick={() => handleToggleSoftDelete(coach)}>
//                       {coach.softDelete ? "Undo Freeze" : "Freeze Account"}
//                     </button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredCoaches.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={(event) => {
//           setRowsPerPage(parseInt(event.target.value, 10));
//           setPage(0);
//         }}
//       />

//       <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
//         <h2>{isAddingCoach ? "Add Coach" : "Edit Coach"}</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={currentCoach?.name || ""}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={currentCoach?.email || ""}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="text"
//             name="phoneNumber"
//             placeholder="Phone Number"
//             value={currentCoach?.phoneNumber || ""}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="text"
//             name="profession"
//             placeholder="Sport"
//             value={currentCoach?.profession || ""}
//             onChange={handleInputChange}
//             required
//           />
//           <input
//             type="text"
//             name="bio"
//             placeholder="Bio"
//             value={currentCoach?.bio || ""}
//             onChange={handleInputChange}
//           />

//           <button type="submit">{isAddingCoach ? "Add Coach" : "Update Coach"}</button>
//           <button type="button" onClick={() => setIsModalOpen(false)}>
//             Cancel
//           </button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageCoach;


import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Tooltip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import Modal from "react-modal";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Domain_URL } from "../../config";

Modal.setAppElement("#root");

interface Coach {
  softDelete: any;
  coachId: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: "Active" | "Frozen";
  sport: string;
}

const ManageCoach = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [newCoach, setNewCoach] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    sport: "Cricket", // default value
    bio: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    sport: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // Get the `softDelete` value from the route query parameters
  const softDelete = new URLSearchParams(location.search).get("softDelete") === "true";

  // Fetch all coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
        setCoaches(response.data || []);
        setFilteredCoaches(response.data || []);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    };
    fetchCoaches();
  }, []);

  // Handle search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = coaches.filter((coach) =>
      coach.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCoaches(filtered);
  };

  // Validation function
  const validateForm = () => {
    const validationErrors: any = {};

    // Name validation: Only alphabets are allowed
    const namePattern = /^[A-Za-z\s]+$/;
    if (!newCoach.name.trim()) validationErrors.name = "Name is required.";
    else if (!namePattern.test(newCoach.name)) validationErrors.name = "Name can only contain alphabets.";

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!newCoach.email.trim()) validationErrors.email = "Email is required.";
    else if (!emailPattern.test(newCoach.email)) validationErrors.email = "Invalid email format.";

    // Phone number validation: Should be 10 digits, cannot start with 0
    const phonePattern = /^(?!0)\d{10}$/;
    if (!newCoach.phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required.";
    else if (!phonePattern.test(newCoach.phoneNumber)) validationErrors.phoneNumber = "Phone number must be 10 digits and cannot start with 0.";

    // Gender validation
    if (!newCoach.gender) validationErrors.gender = "Gender is required.";

    // Sport validation
    if (!newCoach.sport) validationErrors.sport = "Sport is required.";

    // Password validation: Must contain special characters
    const passwordPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!newCoach.password.trim()) validationErrors.password = "Password is required.";
    else if (newCoach.password.length < 6) validationErrors.password = "Password must be at least 6 characters long.";
    else if (!passwordPattern.test(newCoach.password)) validationErrors.password = "Password must contain at least one special character.";

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Handle adding or editing a coach
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if validation fails

    try {
      if (selectedCoach) {
        // Update existing coach
        await axios.put(
          `${Domain_URL}/coach/update/${selectedCoach.coachId}`,
          newCoach
        );
      } else {
        // Add new coach
        await axios.post(`${Domain_URL}/coach/createCoache`, newCoach);
      }
      setIsModalOpen(false);
      setSelectedCoach(null);

      // Refresh coach list
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
      setCoaches(response.data || []);
      setFilteredCoaches(response.data || []);
    } catch (error: any) {
      if (error.response?.data?.message === "Email is already registered.") {
        setErrors((prev) => ({
          ...prev,
          email: "Email is already registered.",
        }));
      } else {
        console.error("Error saving coach:", error);
      }
    }
  };

  // Open modal for adding/editing a coach
  const openModal = (coach?: Coach) => {
    if (coach) {
      setSelectedCoach(coach);
      setNewCoach(coach as any);
    } else {
      setSelectedCoach(null);
      setNewCoach({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        sport: "Cricket", // default value
        bio: "",
        password: "",
      });
    }
    setIsModalOpen(true);
  };

  // Freeze/Unfreeze a coach based on the `softDelete` parameter
  const toggleFreezeCoach = async (coachId: string, action: "delete" | "restore") => {
    try {
      await axios.patch(`${Domain_URL}/coach/coaches/manage/${coachId}`, { action });
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
      setCoaches(response.data || []);
      setFilteredCoaches(response.data || []);
    } catch (error) {
      console.error("Error freezing/unfreezing coach:", error);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <Button
        onClick={() => navigate("/dashboard")}
        startIcon={<FaArrowLeft />}
        variant="outlined"
        sx={{ alignSelf: "flex-start", marginBottom: "20px" }}
      >
        Back to Dashboard
      </Button>
      <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
        Manage Coaches
      </Typography>


      <div style={{ width: "80%", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

  <TextField
    label="Search by Name"
    value={searchQuery}
    onChange={(e) => handleSearch(e.target.value)}
    variant="outlined"
    size="small"
    sx={{ width: "60%" }}
  />


  <Button
    onClick={() => openModal()}
    variant="contained"
    size="small"
    sx={{
      marginLeft: "20px",
      alignSelf: "flex-end",
      paddingLeft: "15px",
      paddingRight: "15px",
    }}
  >
    Add Coach
  </Button>
</div>



<TableContainer component={Paper} className="table-container">
  {/* Table for larger screens */}
  <Table>
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold" }}><strong>Name</strong></TableCell>
        <TableCell sx={{ fontWeight: "bold" }}><strong>Email</strong></TableCell>
        <TableCell sx={{ fontWeight: "bold" }}><strong>Phone</strong></TableCell>
        <TableCell sx={{ fontWeight: "bold" }}><strong>Status</strong></TableCell>
        <TableCell sx={{ fontWeight: "bold" }}><strong>Actions</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredCoaches.map((coach) => (
        <TableRow key={coach.coachId}>
          <TableCell>{coach.name}</TableCell>
          <TableCell>{coach.email}</TableCell>
          <TableCell>{coach.phoneNumber}</TableCell>
          <TableCell>{coach.status}</TableCell>
          <TableCell>
            <Tooltip title="Edit">
              <Button onClick={() => openModal(coach)} startIcon={<FaEdit />} />
            </Tooltip>
            <Tooltip title={coach.softDelete ? "Unfreeze" : "Freeze"}>
              <Button
                onClick={() =>
                  toggleFreezeCoach(
                    coach.coachId,
                    coach.softDelete ? "restore" : "delete"
                  )
                }
              >
                {coach.softDelete ? "Unfreeze" : "Freeze"}
              </Button>
            </Tooltip>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>








      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: '400px',
            margin: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor:'white',
            gap: '16px', // Adds space between elements
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adds depth
          },
            overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
        }}>
        <h2>{selectedCoach ? "Edit Coach" : "Add Coach"}</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            required
            fullWidth
            margin="normal"
            value={newCoach.name}
            onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            label="Email"
            required
            fullWidth
            margin="normal"
            value={newCoach.email}
            onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Phone Number"
            required
            fullWidth
            margin="normal"
            value={newCoach.phoneNumber}
            onChange={(e) => setNewCoach({ ...newCoach, phoneNumber: e.target.value })}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              value={newCoach.gender}
              onChange={(e) => setNewCoach({ ...newCoach, gender: e.target.value })}
              error={!!errors.gender}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Sport</InputLabel>
            <Select
              value={newCoach.sport}
              onChange={(e) => setNewCoach({ ...newCoach, sport: e.target.value })}
            >
              <MenuItem value="Cricket">Cricket</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Password"
            required
            fullWidth
            margin="normal"
            type="password"
            value={newCoach.password}
            onChange={(e) => setNewCoach({ ...newCoach, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button type="submit" variant="contained" sx={{ marginTop: "20px" }}>
            {selectedCoach ? "Update Coach" : "Add Coach"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCoach;
