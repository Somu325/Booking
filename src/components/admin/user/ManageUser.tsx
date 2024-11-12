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
import {  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { FaArrowLeft } from 'react-icons/fa';
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom';

interface User {
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

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  // Handle view user details
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);  // Show the modal for viewing details (no input fields)
    setIsEditing(false); // Ensure it's not in edit mode
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditableUser({ ...user }); // Set the editable user details
    setIsEditing(true);  // Set to editing mode
    setShowModal(true);  // Show the modal for editing
  };

  const handleSoftDelete = async (userId: string, isSoftDeleted: boolean) => {
    try {
      const newStatus = !isSoftDeleted;
      await axios.patch(`${Domain_URL}/user/users/${userId}/softDelete`, { isSoftDeleted: newStatus });

      // Update the users state to reflect the change
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
      try {
        const response = await axios.put(`${Domain_URL}/user/id/${editableUser.userId}`, editableUser);
        console.log("Updated user data", response.data);

        // Update user list with the edited data
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
    setIsEditing(false); // Reset editing mode
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
         <h2> Manage user accounts</h2>
      {/* Search bar */}
      <TextField
        label="Search Users by Name or Email "
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ margin: 2 }}
      />

      {/* User Table */}
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>
                <Button
  variant="contained"
  color={user.softDelete ? "primary" : "error"}  // Remove "default" and use "primary" or "error"
  onClick={() => handleSoftDelete(user.userId, user.softDelete)}
>
  {user.softDelete ? "Undo Delete" : "Soft Delete"}
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

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal for Viewing and Editing User */}
      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? "Edit User" : "User Details"}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {!isEditing ? (
                // View Mode - Show details as text
                <>
                  <Typography variant="h6">Name: {selectedUser.name}</Typography>
                  <Typography variant="h6">Email: {selectedUser.email}</Typography>
                  <Typography variant="h6">Mobile Number: {selectedUser.mobileNumber}</Typography>
                  <Typography variant="h6">Age: {selectedUser.age}</Typography>
                </>
              ) : (
                // Edit Mode - Show input fields
                <>
                  <TextField
                    label="Name"
                    name="name"
                    value={editableUser?.name || ""}
                    onChange={(e) => setEditableUser({ ...editableUser!, name: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    value={editableUser?.email || ""}
                    onChange={(e) => setEditableUser({ ...editableUser!, email: e.target.value })}
                  />
                  <TextField
                    label="Mobile Number"
                    name="mobileNumber"
                    value={editableUser?.mobileNumber || ""}
                    onChange={(e) => setEditableUser({ ...editableUser!, mobileNumber: e.target.value })}
                  />
                  <TextField
                    label="Age"
                    name="age"
                    value={editableUser?.age || ""}
                    onChange={(e) => setEditableUser({ ...editableUser!, age: parseInt(e.target.value) })}
                  />
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Cancel</Button>
          {isEditing && <Button onClick={handleSave} color="primary">Save</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageUser;

