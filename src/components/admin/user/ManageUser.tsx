// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./ManageUser.css";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Drawer,
//   List,
//   ListItemText,
//   Collapse,
//   Box,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
// } from "@mui/material";
// import  MenuIcon from '@mui/icons-material/Menu';
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
// import PersonIcon from "@mui/icons-material/Person";
// import GroupIcon from "@mui/icons-material/Group";
// import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import { Link } from "react-router-dom";
// import { Domain_URL } from "../../config";
// import { ListItemButton } from '@mui/joy';
// import { useNavigate } from 'react-router-dom'; 

// // Updated User interface with userId, isOnHold, isNotAvailable, and status fields
// interface User {
//   issoftDelete: any;
//   userId: string; // Unique identifier for each user
//   name: string;
//   gender: string;
//   mobileNumber: string;
//   age: number;
//   email: string;
//   isOnHold: boolean; // New field to indicate if the user is on hold
//   isNotAvailable: boolean; // New field for Not Available status
//   status: string; // New field to indicate user's status
// }

// const ManageUser: React.FC = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [editableUser, setEditableUser] = useState<User | null>(null);
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [dashboardOpen, setDashboardOpen] = useState(false);
//   const [userOpen, setUserOpen] = useState(false);
//   const [coachOpen, setCoachOpen] = useState(false);
//   const [bookingOpen, setBookingOpen] = useState(false);

//   // Pagination state
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   // Fetch user data from the API
//   const fetchUserData = async () => {
//     try {
//       const response = await axios.get(`${Domain_URL}/user/users`);
//       setUsers(response.data);
//       setFilteredUsers(response.data);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   // Handle search input change
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
    
//     const filtered = users.filter(user =>
//       user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
//     );
//     setFilteredUsers(filtered);
//     setPage(0); // Reset to first page on search
//   };

//   // Handle View button click
//   const handleViewDetails = (user: User) => {
//     setSelectedUser(user);
//     setIsEditing(false);
//     setShowModal(true);
//   };

//   // Handle Edit button click
//   const handleEditClick = (user: User) => {
//     setSelectedUser(user);
//     setEditableUser({ ...user });
//     setIsEditing(true);
//     setShowModal(true);
//   };

//   // Handle input change in the modal
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (editableUser) {
//       setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
//     }
//   };

//   // Handle Save button click
//   const handleSave = async () => {
//     if (editableUser) {
//       try {
//         const response = await axios.put(`${Domain_URL}/user/id/${editableUser.userId}`, editableUser);
//         console.log("Updated user data", response.data);

//         const updatedUsers = users.map(user =>
//           user.userId === editableUser.userId ? editableUser : user
//         );
//         setUsers(updatedUsers);
//         setFilteredUsers(updatedUsers);
//         setShowModal(false);
//         setIsEditing(false);
//       } catch (error) {
//         console.error("Error updating user data:", error);
//       }
//     }
//   };

//   // Handle putting user on hold
//   const handleHoldUser = async () => {
//     if (selectedUser) {
//       try {
//         await axios.put(`${Domain_URL}/user/id/${selectedUser.userId}/soft-delete`, { isOnHold: true });
//         const updatedUsers = users.map(user =>
//           user.userId === selectedUser.userId ? { ...user, isOnHold: true } : user
//         );
//         setUsers(updatedUsers);
//         setFilteredUsers(updatedUsers);
//         setShowModal(false);
//       } catch (error) {
//         console.error("Error putting user on hold:", error);
//       }
//     }
//   };

//   // Handle toggling user active status
//   const handleToggleUserStatus = async (user: User) => {
//     if (user) {
//       try {
//         const newStatus = !user.isOnHold; // Toggle status
//         await axios.patch(`${Domain_URL}/user/users/${user.userId}/softDelete`, { issoftDelete: newStatus });  

//         const updatedUsers = users.map((u) =>
//           u.userId === user.userId ? { ...u, isOnHold: newStatus, status: newStatus ? "Inactive" : "Active" } : u
//         );
//         setUsers(updatedUsers);
//         setFilteredUsers(updatedUsers);
//       } catch (error) {
//         console.error("Error updating user status:", error);
//       }
//     }
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const toggleDashboardMenu = () => {
//     setDashboardOpen(!dashboardOpen);
//   };

//   const toggleUserMenu = () => {
//     setUserOpen(!userOpen);
//   };

//   const toggleCoachMenu = () => {
//     setCoachOpen(!coachOpen);
//   };
//   const gotoBookingcancel = () => {
//     navigate('/Booking-cancel');
//   };
//   const toggleBookingMenu = () => {
//     setBookingOpen(!bookingOpen);
//   };

//   // Handle pagination change
//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   // Handle rows per page change
//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

//   return (
//     <div>
//       {/* Sidebar */}
//       <AppBar position="static">
//         <Toolbar>
//           <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" sx={{ flexGrow: 1 }}>
//             Manage User
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
//         <Box sx={{ width: 250 }} role="presentation">
//           <List>
//             <ListItemButton onClick={toggleDashboardMenu}>
//               <DashboardIcon />
//               <ListItemText primary="Dashboard" />
//               {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
//             </ListItemButton>
//             <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 <ListItemButton sx={{ pl: 4 }} onClick={toggleSidebar} component={Link} to="/AdminOverview">

//                   <ListItemText primary="Overview" />
//                 </ListItemButton>
//                 <ListItemButton sx={{ pl: 4 }} onClick={toggleSidebar} component={Link} to="/Analyst">
//                   <ListItemText primary="Analytics" />
//                 </ListItemButton>
//               </List>
//             </Collapse>

//             <ListItemButton onClick={toggleUserMenu}>
//               <GroupIcon />
//               <ListItemText primary="Manage Coach" />
//               {userOpen ? <ExpandLess /> : <ExpandMore />}
//             </ListItemButton>
//             <Collapse in={userOpen} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageCoach">
//                   <ListItemText primary="Coach Profile" />
//                 </ListItemButton>
//               </List>
//             </Collapse>

//             <ListItemButton onClick={toggleCoachMenu}>
//               <PersonIcon />
//               <ListItemText primary="Manage User" />
//               {coachOpen ? <ExpandLess /> : <ExpandMore />}
//             </ListItemButton>
//             <Collapse in={coachOpen} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageUser">
//                   <ListItemText primary="User Profile" />
//                 </ListItemButton>
//               </List>
//             </Collapse>

//             <ListItemButton onClick={toggleBookingMenu}>
//               <InsertInvitationIcon />
//               <ListItemText primary="Manage Booking" />
//               {bookingOpen ? <ExpandLess /> : <ExpandMore />}
//             </ListItemButton>
//             <Collapse in={bookingOpen} timeout="auto" unmountOnExit>
//               <List component="div" disablePadding>
//                 <ListItemButton sx={{ pl: 4 }} component={Link} to="/Booking">
//                   <ListItemText primary="Booking List" />
//                 </ListItemButton>
//               </List>
//             </Collapse>

//             <ListItemButton onClick={() => { gotoBookingcancel(); toggleSidebar(); }}>
//             <InsertInvitationIcon />
//             <ListItemText primary="Booking Cancel" />
//           </ListItemButton>
//           </List>
//         </Box>
//       </Drawer>

//       {/* Search Bar */}
//       <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />

//       {/* User Table */}
//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Gender</TableCell>
//               <TableCell>Mobile Number</TableCell>
//               <TableCell>Age</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>soft Delete</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedUsers.map((user) => (
//               <TableRow key={user.userId}>
//                 <TableCell>{user.name}</TableCell>
//                 <TableCell>{user.gender}</TableCell>
//                 <TableCell>{user.mobileNumber}</TableCell>
//                 <TableCell>{user.age}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.issoftDelete ? "Yes" : "No"}</TableCell>
//                 <TableCell>
//                   <button onClick={() => handleViewDetails(user)}>View</button>
//                   <button onClick={() => handleEditClick(user)}>Edit</button>
//                   <button onClick={() => handleToggleUserStatus(user)}>Delete</button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <TablePagination
//         rowsPerPageOptions={[5, 10, 25]}
//         component="div"
//         count={filteredUsers.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
      
//       {/* Modal Component for User Details */}
//       {showModal && (
//         <div className="modal">
//           <div className="modal-content">
//             <h2>{isEditing ? "Edit User" : "User Details"}</h2>
//             {editableUser && (
//               <div>
//                 <input name="name" value={editableUser.name} onChange={handleChange} />
//                 <input name="gender" value={editableUser.gender} onChange={handleChange} />
//                 <input name="mobileNumber" value={editableUser.mobileNumber} onChange={handleChange} />
//                 <input name="age" value={editableUser.age} onChange={handleChange} />
//                 <input name="email" value={editableUser.email} onChange={handleChange} />
//               </div>
//             )}
//             <button onClick={isEditing ? handleSave : handleHoldUser}>{isEditing ? "Save" : "Put on Hold"}</button>
//             <button onClick={() => setShowModal(false)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageUser;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FaArrowLeft } from 'react-icons/fa';
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom';
import "./ManageUser.css"
interface User {
  verified: any;
  userId: string;
  name: string;
  email: string;
  mobileNumber: string;
  age: number;
  status: string;
  softDelete: boolean;
}

const ManageUser: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: '',
    email: '',
    mobileNo: '',
    password: ''
  });
  const [editableValidationErrors, setEditableValidationErrors] = useState({
    name: '',
    email: '',
    mobileNo: '',
  });
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleClose = () => {
    setOpen(false);
    setValidationErrors({ name: '', email: '', mobileNo: '', password: '' });
  };

  const handleAddUser = async () => {
    // Validation checks
    const errors = { name: '', email: '', mobileNo: '', password: '' };
    let isValid = true;

    // Validate name (should not contain digits or special characters)
    const nameRegex = /^[A-Za-z\s]+$/; // Only letters and spaces allowed
    if (!nameRegex.test(name)) {
      errors.name = "Please enter a valid name (letters and spaces only).";
      isValid = false;
    }

    // Validate mobile number (should not start with 0 and must be 10 digits)
    const mobileRegex = /^[1-9][0-9]{9}$/; // First digit must not be 0, and there should be exactly 10 digits
    if (!mobileRegex.test(mobileNo)) {
      errors.mobileNo = "Please enter a valid 10-digit mobile number that does not start with 0.";
      isValid = false;
    }

    // Validate email (letters followed by digits, and ends with @gmail.com)
    const emailRegex = /^[a-zA-Z]+[0-9]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email.";
      isValid = false;
    }

    // Validate password (should be between 8-16 characters and contain upper, lower, number, and special characters)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,16}$/;
    if (!passwordRegex.test(password)) {
      errors.password = "Password must be 8-16 characters, include uppercase, lowercase, a number, and a special character.";
      isValid = false;
    }

    setValidationErrors(errors);

    if (!isValid) {
      return;
    }

    const newUser = {
      name,
      email,
      mobileNumber: mobileNo,
      password,
    };

    try {
      const response = await axios.post(`${Domain_URL}/user/signup`, newUser, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const updatedUsers = [...users, response.data];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      // Close dialog and reset form fields
      setOpen(false);
      setName('');
      setEmail('');
      setMobileNo('');
      setPassword('');
      setValidationErrors({ name: '', email: '', mobileNo: '', password: '' });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response);
        if (error.response && error.response.status === 400) {
          setValidationErrors((prev) => ({ ...prev, email: "This email is already registered." }));
        } else if (error.response && error.response.data) {
          alert(`Error: ${error.response.data.error || "An error occurred."}`);
        } else {
          alert("An unexpected error occurred. Please try again later.");
        }
      } else {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
      }
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Domain_URL}/user/users`);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setPage(0);
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
    setIsEditing(false);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditableUser({ ...user });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSoftDelete = async (userId: string, isSoftDeleted: boolean) => {
    try {
      const newStatus = !isSoftDeleted;
      await axios.patch(`${Domain_URL}/user/users/${userId}/softDelete`, { isSoftDeleted: newStatus });

      const updatedUsers = users.map((user) =>
        user.userId === userId ? { ...user, softDelete: newStatus } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      if (selectedUser?.userId === userId) {
        setSelectedUser({ ...selectedUser, softDelete: newStatus });
      }
    } catch (error) {
      console.error("Error updating soft delete status:", error);
    }
  };

  const handleSave = async () => {
    if (editableUser) {
      const errors = { name: '', email: '', mobileNo: '' };
      let isValid = true;

      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(editableUser.name)) {
        errors.name = "Please enter a valid name (letters and spaces only).";
        isValid = false;
      }

      const mobileRegex = /^[1-9][0-9]{9}$/;
      if (!mobileRegex.test(editableUser.mobileNumber)) {
        errors.mobileNo = "Please enter a valid 10-digit mobile number that does not start with 0.";
        isValid = false;
      }

      const emailRegex = /^[a-zA-Z]+[0-9]+@gmail\.com$/;
      if (!emailRegex.test(editableUser.email)) {
        errors.email = "Please enter a valid email.";
        isValid = false;
      }

      setEditableValidationErrors(errors);

      if (!isValid) {
        return;
      }

      try {
        const response = await axios.put(`${Domain_URL}/user/id/${editableUser.userId}`, editableUser);
        console.log("Updated user data", response.data);

        const updatedUsers = users.map(user =>
          user.userId === editableUser.userId ? editableUser : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowModal(false);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

 
  return (
    <div>
      <button onClick={goBackToDashboard} className="go-back-button">
        <FaArrowLeft /> Go Back to Dashboard
      </button>
      <h2>Manage User Accounts</h2>
      <TextField
        label="Search Users by Name or Email"
        variant="outlined"
        className="search"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ margin: 1 }}
      />
      <div>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add User
        </Button>
        <Dialog
  open={open}
  onClose={(_event, reason) => {
    if (reason === "backdropClick") {
      // Prevent closing the dialog when clicking outside (backdrop)
      return;
    }
    handleClose();  // This will close the dialog when clicking the close button or other defined actions
  }}
>

          <DialogTitle>Add User Details</DialogTitle>
          <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!validationErrors.name}
            helperText={validationErrors.name}
          />~
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
          />
          <TextField
            margin="dense"
            label="Mobile No"
            type="tel"
            fullWidth
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            error={!!validationErrors.mobileNo}
            helperText={validationErrors.mobileNo}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddUser} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <TableContainer sx={{ maxHeight: 600 }} className="Card">
        <Table stickyHeader aria-label="sticky table" >
          <TableHead>
            <TableRow>
            <TableCell sx={{ backgroundColor: '#007bff', color: 'white', padding:'none' }}>Name</TableCell>
              <TableCell sx={{ backgroundColor: '#007bff', color: 'white', padding:'none' }}>Email</TableCell>
              <TableCell sx={{ backgroundColor: '#007bff', color: 'white',padding:'none' }}>Mobile Number</TableCell>
              <TableCell sx={{ backgroundColor: '#007bff', color: 'white' ,padding:'none'}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="Table-data-cards">
  {paginatedUsers.map((user) => (
    <TableRow key={user.userId}>
      <TableCell data-label="Name">{user.name}</TableCell>
      <TableCell data-label="Email">{user.email}</TableCell>
      <TableCell data-label="Mobile Number">{user.mobileNumber}</TableCell>
      <TableCell data-label="Action">
        <Button
          variant="contained"
          color={user.softDelete ? "primary" : "error"}
          onClick={() => handleSoftDelete(user.userId, user.softDelete)}
        >
          {user.softDelete ? "Undo Freeze" : "Freeze Account"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleViewDetails(user)}
          sx={{ marginLeft: 1 }}
        >
          View
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleEditClick(user)}
          sx={{ marginLeft: 1 }}
        >
          Edit
        </Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
      <TablePagination
  rowsPerPageOptions={[5, 10, 25]}
  component="div"
  count={filteredUsers.length}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  sx={{
    display: 'flex',
    justifyContent: 'center', // Center pagination on mobile
    marginTop: 2,
    padding: 1
  }}
/>
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>{isEditing ? "Edit User" : "User Details"}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              {isEditing ? (
                <>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    value={editableUser?.name || ''}
                    onChange={(e) => setEditableUser({ ...editableUser!, name: e.target.value })}
                    error={!!editableValidationErrors.name}
                    helperText={editableValidationErrors.name}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    value={editableUser?.email || ''}
                    onChange={(e) => setEditableUser({ ...editableUser!, email: e.target.value })}
                    error={!!editableValidationErrors.email}
                    helperText={editableValidationErrors.email}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Mobile Number"
                    value={editableUser?.mobileNumber || ''}
                    onChange={(e) => setEditableUser({ ...editableUser!, mobileNumber: e.target.value })}
                    error={!!editableValidationErrors.mobileNo}
                    helperText={editableValidationErrors.mobileNo}
                  />
              
                </>
              ) : (
                <>
                  <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
                  <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                  <Typography><strong>Mobile Number:</strong> {selectedUser.mobileNumber}</Typography>
                  <Typography><strong>Account Frozen:</strong> {selectedUser.softDelete ? 'Yes' : 'No'}</Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              <Button onClick={handleSave} color="primary">Save</Button>
              <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
            </>
          ) : (
            <Button onClick={handleCloseModal} color="primary">Close</Button>
          )}
        </DialogActions>
      </Dialog>
  </div>
  );
};

export default ManageUser;

