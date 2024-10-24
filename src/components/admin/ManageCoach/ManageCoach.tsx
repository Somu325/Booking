import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from "react-router-dom";
import "./ManageCoach.css";
import { Domain_URL } from "../../config";
import {  ListItemButton } from '@mui/joy';

// Define interface for coach data
interface Coach {
  coachId: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  email: string;
  emailVerified: boolean;
  age?: number | null;
  phoneNumber: string;
  profession: string;
  bio?: string | null;
  experience: string;
  pushNotificationEnabled: boolean;
  status: 'Active' | 'Inactive';
}

// Set the modal app element for accessibility
Modal.setAppElement('#root');

const ManageCoach: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Fixed number of rows per page

  // Fetch data from the database when component mounts
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
        if (Array.isArray(response.data)) {
          setCoaches(response.data);
          setFilteredCoaches(response.data);
        } else {
          console.error("API did not return an array of coaches");
          setCoaches([]);
          setFilteredCoaches([]);
        }
      } catch (error) {
        console.error("Error fetching coach data", error);
        setCoaches([]);
        setFilteredCoaches([]);
      }
    };

    fetchCoaches();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = coaches.filter(coach =>
      coach.name.toLowerCase().includes(term) ||
      coach.profession.toLowerCase().includes(term)
    );
    setFilteredCoaches(filtered);
    setPage(0); // Reset page when searching
  };

  const handleEdit = (coach: Coach) => {
    setCurrentCoach(coach);
    setIsModalOpen(true);
    setIsAddingCoach(false);
  };

  const handleAdd = () => {
    const emptyCoach: Coach = {
      coachId: '',
      name: '',
      gender: 'male',
      email: '',
      emailVerified: false,
      phoneNumber: '',
      profession: '',
      bio: '',
      experience: '',
      pushNotificationEnabled: false,
      status: 'Active',
    };
    setCurrentCoach(emptyCoach);
    setIsAddingCoach(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentCoach) {
      try {
        if (isAddingCoach) {
          const response = await axios.post(`${Domain_URL}/coach/add`, currentCoach);
          setCoaches([...coaches, response.data]);
          setFilteredCoaches([...filteredCoaches, response.data]);
        } else {
          await axios.put(`${Domain_URL}/coach/update/${currentCoach.coachId}`, currentCoach);
          const updatedCoaches = coaches.map(coach => (coach.coachId === currentCoach.coachId ? currentCoach : coach));
          setCoaches(updatedCoaches);
          setFilteredCoaches(updatedCoaches);
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error(`Error ${isAddingCoach ? 'adding' : 'updating'} coach`, error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${Domain_URL}/coach/${id}`);
      setCoaches(coaches.filter(coach => coach.coachId !== id));
      setFilteredCoaches(filteredCoaches.filter(coach => coach.coachId !== id));
    } catch (error) {
      console.error("Error deleting coach", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (currentCoach) {
      setCurrentCoach({
        ...currentCoach,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleToggleStatus = async (coach: Coach) => {
    try {
      // Determine the new status
      const updatedStatus: 'Active' | 'Inactive' = coach.status === 'Active' ? 'Inactive' : 'Active';
  
      // Send a request to update the status
      await axios.put(`${Domain_URL}/coach/update-status/${coach.coachId}`, { status: updatedStatus });
  
      // Map through coaches to create the updated list
      const updatedCoaches: Coach[] = coaches.map(c =>
        c.coachId === coach.coachId ? { ...c, status: updatedStatus } : c
      );
  
      // Update state with the new coach list
      setCoaches(updatedCoaches);
      setFilteredCoaches(updatedCoaches);
    } catch (error) {
      console.error("Error toggling coach status", error);
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Calculate paginated coaches
  const paginatedCoaches = filteredCoaches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
 
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Manage Coach
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
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/AdminOverview">
                  <ListItemText primary="Overview" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/Analyst">
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

            <ListItem>
      <ListItemButton onClick={toggleBookingMenu}>
        <InsertInvitationIcon />
        <ListItemText primary="Manage Bookings" />
        {bookingOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
    </ListItem>
            <Collapse in={bookingOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} to="/Booking">
                  <ListItemText primary="Booking Profile" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </Box>
      </Drawer>


      <Box sx={{ p: 2 }}>
        <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Search by name or profession" />
        <button onClick={handleAdd}>Add Coach</button>
      </Box>

      {/* Coach Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Profession</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCoaches.map(coach => (
              <TableRow key={coach.coachId}>
                <TableCell>{coach.name}</TableCell>
                <TableCell>{coach.email}</TableCell>
                <TableCell>{coach.phoneNumber}</TableCell>
                <TableCell>{coach.profession}</TableCell>
                <TableCell>{coach.status}</TableCell>
                <TableCell>
                  <button onClick={() => handleEdit(coach)}>Edit</button>
                  <button onClick={() => handleDelete(coach.coachId)}>Delete</button>
                  <button onClick={() => handleToggleStatus(coach)}>
                    {coach.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
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
        count={filteredCoaches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      {/* Modal for adding/editing coach */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <h2>{isAddingCoach ? 'Add Coach' : 'Edit Coach'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={currentCoach?.name || ''} onChange={handleInputChange} required />
          <input type="email" name="email" placeholder="Email" value={currentCoach?.email || ''} onChange={handleInputChange} required />
          <input type="text" name="phoneNumber" placeholder="Phone Number" value={currentCoach?.phoneNumber || ''} onChange={handleInputChange} required />
          <input type="text" name="profession" placeholder="Profession" value={currentCoach?.profession || ''} onChange={handleInputChange} required />
          <input type="text" name="bio" placeholder="Bio" value={currentCoach?.bio || ''} onChange={handleInputChange} />
          <input type="text" name="experience" placeholder="Experience" value={currentCoach?.experience || ''} onChange={handleInputChange} />
          <button type="submit">{isAddingCoach ? 'Add Coach' : 'Update Coach'}</button>
          <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCoach;
