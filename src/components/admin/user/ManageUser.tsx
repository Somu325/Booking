import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageUser.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Domain_URL } from "../../config";
import { ListItemButton } from '@mui/joy';

// Updated User interface with userId, isOnHold, isNotAvailable, and status fields
interface User {
  userId: string; // Unique identifier for each user
  name: string;
  gender: string;
  mobileNumber: string;
  age: number;
  email: string;
  isOnHold: boolean; // New field to indicate if the user is on hold
  isNotAvailable: boolean; // New field for Not Available status
  status: string; // New field to indicate user's status
}

const ManageUser: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editableUser, setEditableUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${Domain_URL}/user/users`);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
    setPage(0); // Reset to first page on search
  };

  // Handle View button click
  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsEditing(false);
    setShowModal(true);
  };

  // Handle Edit button click
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditableUser({ ...user });
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle input change in the modal
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editableUser) {
      setEditableUser({ ...editableUser, [e.target.name]: e.target.value });
    }
  };

  // Handle Save button click
  const handleSave = async () => {
    if (editableUser) {
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

  // Handle putting user on hold
  const handleHoldUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(`${Domain_URL}/user/id/${selectedUser.userId}/soft-delete`, { isOnHold: true });
        const updatedUsers = users.map(user =>
          user.userId === selectedUser.userId ? { ...user, isOnHold: true } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setShowModal(false);
      } catch (error) {
        console.error("Error putting user on hold:", error);
      }
    }
  };

  // Handle toggling user active status
  const handleToggleUserStatus = async (user: User) => {
    if (user) {
      try {
        const newStatus = !user.isOnHold; // Toggle status
        await axios.patch(`${Domain_URL}/user/id/${user.userId}/status`, { isOnHold: newStatus });

        const updatedUsers = users.map((u) =>
          u.userId === user.userId ? { ...u, isOnHold: newStatus, status: newStatus ? "Inactive" : "Active" } : u
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } catch (error) {
        console.error("Error updating user status:", error);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDashboardMenu = () => {
    setDashboardOpen(!dashboardOpen);
  };

  const toggleUserMenu = () => {
    setUserOpen(!userOpen);
  };

  const toggleCoachMenu = () => {
    setCoachOpen(!coachOpen);
  };

  const toggleBookingMenu = () => {
    setBookingOpen(!bookingOpen);
  };

  // Handle pagination change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      {/* Sidebar */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Manage User
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItemButton onClick={toggleDashboardMenu}>
              <DashboardIcon />
              <ListItemText primary="Dashboard" />
              {dashboardOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={dashboardOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} onClick={toggleSidebar} component={Link} to="/AdminOverview">
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} onClick={toggleSidebar} component={Link} to="/Analyst">
                  <ListItemText primary="Analytics" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={toggleUserMenu}>
              <GroupIcon />
              <ListItemText primary="Manage Coach" />
              {userOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={userOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageCoach">
                  <ListItemText primary="Coach Profile" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={toggleCoachMenu}>
              <PersonIcon />
              <ListItemText primary="Manage User" />
              {coachOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={coachOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/ManageUser">
                  <ListItemText primary="User Profile" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={toggleBookingMenu}>
              <InsertInvitationIcon />
              <ListItemText primary="Manage Booking" />
              {bookingOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={bookingOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/Booking">
                  <ListItemText primary="Booking List" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>

      {/* Search Bar */}
      <input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />

      {/* User Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>On Hold</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell>{user.age}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isOnHold ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <button onClick={() => handleViewDetails(user)}>View</button>
                  <button onClick={() => handleEditClick(user)}>Edit</button>
                  <button onClick={() => handleToggleUserStatus(user)}>Toggle Status</button>
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
      />
      
      {/* Modal Component for User Details */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditing ? "Edit User" : "User Details"}</h2>
            {editableUser && (
              <div>
                <input name="name" value={editableUser.name} onChange={handleChange} />
                <input name="gender" value={editableUser.gender} onChange={handleChange} />
                <input name="mobileNumber" value={editableUser.mobileNumber} onChange={handleChange} />
                <input name="age" value={editableUser.age} onChange={handleChange} />
                <input name="email" value={editableUser.email} onChange={handleChange} />
              </div>
            )}
            <button onClick={isEditing ? handleSave : handleHoldUser}>{isEditing ? "Save" : "Put on Hold"}</button>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
