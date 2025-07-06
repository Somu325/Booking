
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   TextField,
//   Tooltip,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Typography,
// } from "@mui/material";
// import Modal from "react-modal";
// import { FaArrowLeft, FaEdit } from "react-icons/fa";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Domain_URL } from "../../config";

// Modal.setAppElement("#root");

// interface Coach {
//   softDelete: any;
//   coachId: string;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   status: "Active" | "Frozen";
//   sport: string;
// }

// const ManageCoach = () => {
//   const [coaches, setCoaches] = useState<Coach[]>([]);
//   const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
//   const [newCoach, setNewCoach] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     gender: "",
//     sport: "Cricket", // default value
//     bio: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     phoneNumber: "",
//     gender: "",
//     sport: "",
//     password: "",
//   });

//   const navigate = useNavigate();
//   const location = useLocation();

//   // Get the `softDelete` value from the route query parameters
//   const softDelete = new URLSearchParams(location.search).get("softDelete") === "true";

//   // Fetch all coaches
//   useEffect(() => {
//     const fetchCoaches = async () => {
//       try {
//         const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
//         setCoaches(response.data || []);
//         setFilteredCoaches(response.data || []);
//       } catch (error) {
//         console.error("Error fetching coaches:", error);
//       }
//     };
//     fetchCoaches();
//   }, []);

//   // Handle search filter
//   const handleSearch = (query: string) => {
//     setSearchQuery(query);
//     const filtered = coaches.filter((coach) =>
//       coach.name.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredCoaches(filtered);
//   };

//   // Validation function
//   const validateForm = () => {
//     const validationErrors: any = {};

//     // Name validation: Only alphabets are allowed
//     const namePattern = /^[A-Za-z\s]+$/;
//     if (!newCoach.name.trim()) validationErrors.name = "Name is required.";
//     else if (!namePattern.test(newCoach.name)) validationErrors.name = "Name can only contain alphabets.";

//     // Email validation
//     const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     if (!newCoach.email.trim()) validationErrors.email = "Email is required.";
//     else if (!emailPattern.test(newCoach.email)) validationErrors.email = "Invalid email format.";

//     // Phone number validation: Should be 10 digits, cannot start with 0
//     const phonePattern = /^(?!0)\d{10}$/;
//     if (!newCoach.phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required.";
//     else if (!phonePattern.test(newCoach.phoneNumber)) validationErrors.phoneNumber = "Phone number must be 10 digits and cannot start with 0.";

//     // Gender validation
//     if (!newCoach.gender) validationErrors.gender = "Gender is required.";

//     // Sport validation
//     if (!newCoach.sport) validationErrors.sport = "Sport is required.";

//     // Password validation: Must contain special characters
//     const passwordPattern = /[!@#$%^&*(),.?":{}|<>]/;
//     if (!newCoach.password.trim()) validationErrors.password = "Password is required.";
//     else if (newCoach.password.length < 6) validationErrors.password = "Password must be at least 6 characters long.";
//     else if (!passwordPattern.test(newCoach.password)) validationErrors.password = "Password must contain at least one special character.";

//     setErrors(validationErrors);
//     return Object.keys(validationErrors).length === 0;
//   };

//   // Handle adding or editing a coach
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!validateForm()) return; // Stop if validation fails

//     try {
//       if (selectedCoach) {
//         // Update existing coach
//         await axios.put(
//           `${Domain_URL}/coach/update/${selectedCoach.coachId}`,
//           newCoach
//         );
//       } else {
//         // Add new coach
//         await axios.post(`${Domain_URL}/coach/createCoache`, newCoach);
//       }
//       setIsModalOpen(false);
//       setSelectedCoach(null);

//       // Refresh coach list
//       const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
//       setCoaches(response.data || []);
//       setFilteredCoaches(response.data || []);
//     } catch (error: any) {
//       if (error.response?.data?.message === "Email is already registered.") {
//         setErrors((prev) => ({
//           ...prev,
//           email: "Email is already registered.",
//         }));
//       } else {
//         console.error("Error saving coach:", error);
//       }
//     }
//   };

//   // Open modal for adding/editing a coach
//   const openModal = (coach?: Coach) => {
//     if (coach) {
//       setSelectedCoach(coach);
//       setNewCoach(coach as any);
//     } else {
//       setSelectedCoach(null);
//       setNewCoach({
//         name: "",
//         email: "",
//         phoneNumber: "",
//         gender: "",
//         sport: "Cricket", // default value
//         bio: "",
//         password: "",
//       });
//     }
//     setIsModalOpen(true);
//   };

//   // Freeze/Unfreeze a coach based on the `softDelete` parameter
//   const toggleFreezeCoach = async (coachId: string, action: "delete" | "restore") => {
//     try {
//       await axios.patch(`${Domain_URL}/coach/coaches/manage/${coachId}`, { action });
//       const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
//       setCoaches(response.data || []);
//       setFilteredCoaches(response.data || []);
//     } catch (error) {
//       console.error("Error freezing/unfreezing coach:", error);
//     }
//   };

//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
//       <Button
//         onClick={() => navigate("/dashboard")}
//         startIcon={<FaArrowLeft />}
//         variant="outlined"
//         sx={{ alignSelf: "flex-start", marginBottom: "20px" }}
//       >
//         Back to Dashboard
//       </Button>
//       <Typography variant="h4" sx={{ marginBottom: "20px", fontWeight: "bold" }}>
//         Manage Coaches
//       </Typography>


//       <div style={{ width: "80%", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>

//   <TextField
//     label="Search by Name"
//     value={searchQuery}
//     onChange={(e) => handleSearch(e.target.value)}
//     variant="outlined"
//     size="small"
//     sx={{ width: "60%" }}
//   />


//   <Button
//     onClick={() => openModal()}
//     variant="contained"
//     size="small"
//     sx={{
//       marginLeft: "20px",
//       alignSelf: "flex-end",
//       paddingLeft: "15px",
//       paddingRight: "15px",
//     }}
//   >
//     Add Coach
//   </Button>
// </div>

// <TableContainer component={Paper} className="table-container">
//   {/* Table for larger screens */}
//   <Table>
//     <TableHead>
//       <TableRow>
//         <TableCell sx={{ fontWeight: "bold" }}><strong>Name</strong></TableCell>
//         <TableCell sx={{ fontWeight: "bold" }}><strong>Email</strong></TableCell>
//         <TableCell sx={{ fontWeight: "bold" }}><strong>Phone</strong></TableCell>
//         <TableCell sx={{ fontWeight: "bold" }}><strong>Status</strong></TableCell>
//         <TableCell sx={{ fontWeight: "bold" }}><strong>Actions</strong></TableCell>
//       </TableRow>
//     </TableHead>
//     <TableBody>
//       {filteredCoaches.map((coach) => (
//         <TableRow key={coach.coachId}>
//           <TableCell>{coach.name}</TableCell>
//           <TableCell>{coach.email}</TableCell>
//           <TableCell>{coach.phoneNumber}</TableCell>
//           <TableCell>{coach.status}</TableCell>
//           <TableCell>
//             <Tooltip title="Edit">
//               <Button onClick={() => openModal(coach)} startIcon={<FaEdit />} />
//             </Tooltip>
//             <Tooltip title={coach.softDelete ? "Unfreeze" : "Freeze"}>
//               <Button
//                 onClick={() =>
//                   toggleFreezeCoach(
//                     coach.coachId,
//                     coach.softDelete ? "restore" : "delete"
//                   )
//                 }
//               >
//                 {coach.softDelete ? "Unfreeze" : "Freeze"}
//               </Button>
//             </Tooltip>
//           </TableCell>
//         </TableRow>
//       ))}
//     </TableBody>
//   </Table>
// </TableContainer>

//       <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}
//         style={{
//           content: {
//             width: '400px',
//             margin: 'auto',
//             padding: '20px',
//             display: 'flex',
//             flexDirection: 'column',
//             backgroundColor:'white',
//             gap: '16px', // Adds space between elements
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Adds depth
//           },
//             overlay: {
//       backgroundColor: 'rgba(0, 0, 0, 0.5)'
//             },
//         }}>
//         <h2>{selectedCoach ? "Edit Coach" : "Add Coach"}</h2>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             label="Name"
//             required
//             fullWidth
//             margin="normal"
//             value={newCoach.name}
//             onChange={(e) => setNewCoach({ ...newCoach, name: e.target.value })}
//             error={!!errors.name}
//             helperText={errors.name}
//           />
//           <TextField
//             label="Email"
//             required
//             fullWidth
//             margin="normal"
//             value={newCoach.email}
//             onChange={(e) => setNewCoach({ ...newCoach, email: e.target.value })}
//             error={!!errors.email}
//             helperText={errors.email}
//           />
//           <TextField
//             label="Phone Number"
//             required
//             fullWidth
//             margin="normal"
//             value={newCoach.phoneNumber}
//             onChange={(e) => setNewCoach({ ...newCoach, phoneNumber: e.target.value })}
//             error={!!errors.phoneNumber}
//             helperText={errors.phoneNumber}
//           />
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Gender</InputLabel>
//             <Select
//               value={newCoach.gender}
//               onChange={(e) => setNewCoach({ ...newCoach, gender: e.target.value })}
//               error={!!errors.gender}
//             >
//               <MenuItem value="male">Male</MenuItem>
//               <MenuItem value="female">Female</MenuItem>
//               <MenuItem value="other">Other</MenuItem>
//             </Select>
//           </FormControl>
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Sport</InputLabel>
//             <Select
//               value={newCoach.sport}
//               onChange={(e) => setNewCoach({ ...newCoach, sport: e.target.value })}
//             >
//               <MenuItem value="Cricket">Cricket</MenuItem>
//             </Select>
//           </FormControl>
//           <TextField
//             label="Password"
//             required
//             fullWidth
//             margin="normal"
//             type="password"
//             value={newCoach.password}
//             onChange={(e) => setNewCoach({ ...newCoach, password: e.target.value })}
//             error={!!errors.password}
//             helperText={errors.password}
//           />
//           <Button type="submit" variant="contained" sx={{ marginTop: "20px" }}>
//             {selectedCoach ? "Update Coach" : "Add Coach"}
//           </Button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageCoach;




'use client'

import React, { useState, useEffect } from "react"
import axios from "axios"
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
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material"
import Modal from "react-modal"
import { FaArrowLeft, FaEdit } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Domain_URL } from "../../config"

Modal.setAppElement("#root")

interface Coach {
  softDelete: any
  coachId: string
  name: string
  email: string
  phoneNumber: string
  status: "Active" | "Frozen"
  sport: string
}

export default function Component() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null)
  const [newCoach, setNewCoach] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    sport: "Cricket", // default value
    bio: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    sport: "",
    password: "",
  })

  const navigate = useNavigate()
  // const location = useLocation()

  // Get the `softDelete` value from the route query parameters
  // const softDelete = new URLSearchParams(location.search).get("softDelete") === "true"

  // Check if the screen is mobile
  const isMobile = useMediaQuery('(max-width:600px)')

  // Fetch all coaches
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`)
        setCoaches(response.data || [])
        setFilteredCoaches(response.data || [])
      } catch (error) {
        console.error("Error fetching coaches:", error)
      }
    }
    fetchCoaches()
  }, [])

  // Handle search filter
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = coaches.filter((coach) =>
      coach.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCoaches(filtered)
  }

  // Validation function
  const validateForm = () => {
    const validationErrors: any = {}

    // Name validation: Only alphabets are allowed
    const namePattern = /^[A-Za-z\s]+$/
    if (!newCoach.name.trim()) validationErrors.name = "Name is required."
    else if (!namePattern.test(newCoach.name)) validationErrors.name = "Name can only contain alphabets."

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    if (!newCoach.email.trim()) validationErrors.email = "Email is required."
    else if (!emailPattern.test(newCoach.email)) validationErrors.email = "Invalid email format."

    // Phone number validation: Should be 10 digits, cannot start with 0
    const phonePattern = /^(?!0)\d{10}$/
    if (!newCoach.phoneNumber.trim()) validationErrors.phoneNumber = "Phone number is required."
    else if (!phonePattern.test(newCoach.phoneNumber)) validationErrors.phoneNumber = "Phone number must be 10 digits and cannot start with 0."

    // Gender validation
    if (!newCoach.gender) validationErrors.gender = "Gender is required."

    // Sport validation
    if (!newCoach.sport) validationErrors.sport = "Sport is required."

    // Password validation: Must contain special characters
    const passwordPattern = /[!@#$%^&*(),.?":{}|<>]/
    if (!newCoach.password.trim()) validationErrors.password = "Password is required."
    else if (newCoach.password.length < 6) validationErrors.password = "Password must be at least 6 characters long."
    else if (!passwordPattern.test(newCoach.password)) validationErrors.password = "Password must contain at least one special character."

    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  }

  // Handle adding or editing a coach
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return // Stop if validation fails

    try {
      if (selectedCoach) {
        // Update existing coach
        await axios.put(
          `${Domain_URL}/coach/update/${selectedCoach.coachId}`,
          newCoach
        )
      } else {
        // Add new coach
        await axios.post(`${Domain_URL}/coach/createCoache`, newCoach)
      }
      setIsModalOpen(false)
      setSelectedCoach(null)

      // Refresh coach list
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`)
      setCoaches(response.data || [])
      setFilteredCoaches(response.data || [])
    } catch (error: any) {
      if (error.response?.data?.message === "Email is already registered.") {
        setErrors((prev) => ({
          ...prev,
          email: "Email is already registered.",
        }))
      } else {
        console.error("Error saving coach:", error)
      }
    }
  }

  // Open modal for adding/editing a coach
  const openModal = (coach?: Coach) => {
    if (coach) {
      setSelectedCoach(coach)
      setNewCoach(coach as any)
    } else {
      setSelectedCoach(null)
      setNewCoach({
        name: "",
        email: "",
        phoneNumber: "",
        gender: "",
        sport: "Cricket", // default value
        bio: "",
        password: "",
      })
    }
    setIsModalOpen(true)
  }

  // Freeze/Unfreeze a coach based on the `softDelete` parameter
  const toggleFreezeCoach = async (coachId: string, action: "delete" | "restore") => {
    try {
      await axios.patch(`${Domain_URL}/coach/coaches/manage/${coachId}`, { action })
      const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`)
      setCoaches(response.data || [])
      setFilteredCoaches(response.data || [])
    } catch (error) {
      console.error("Error freezing/unfreezing coach:", error)
    }
  }

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
          sx={{ width: "60%"  }}
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

      {isMobile ? (
        // Card view for mobile
        <div style={{ width: "100%" }}>
          {filteredCoaches.map((coach) => (
            <Card key={coach.coachId} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{coach.name}</Typography>
                <Typography variant="body2">Email: {coach.email}</Typography>
                <Typography variant="body2">Phone: {coach.phoneNumber}</Typography>
                <Typography variant="body2">Status: {coach.status}</Typography>
                <div style={{ marginTop: 10 }}>
                  <Button onClick={() => openModal(coach)} startIcon={<FaEdit />} size="small">
                    Edit
                  </Button>
                  <Button
                    onClick={() =>
                      toggleFreezeCoach(
                        coach.coachId,
                        coach.softDelete ? "restore" : "delete"
                      )
                    }
                    size="small"
                  >
                    {coach.softDelete ? "Unfreeze" : "Freeze"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Table view for larger screens
        <TableContainer component={Paper} className="table-container">
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
      )}

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            width: '320px',
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
  )
}