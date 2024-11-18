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
// } from '@mui/material';
// import { FaArrowLeft } from 'react-icons/fa';
// import "./ManageCoach.css";
// import { Domain_URL } from "../../config";
// import { useNavigate } from 'react-router-dom';

// // Define interface for coach data
// interface Coach {
//   coachId: string;
//   name: string;
//   gender: 'male' | 'female' | 'other';
//   email: string;
//   emailVerified: boolean;
//   age?: number | null;
//   phoneNumber: string;
//   profession: string;
//   bio?: string | null;
//   experience: string;
//   pushNotificationEnabled: boolean;
//   status: 'Active' | 'Inactive';
//   softDelete: boolean; // added for soft delete flag
// }

// Modal.setAppElement('#root');

// const ManageCoach: React.FC = () => {
//   const [coaches, setCoaches] = useState<Coach[]>([]);
//   const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
//   // const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
//   const [isAddingCoach, setIsAddingCoach] = useState(false);

//   const navigate = useNavigate();

//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

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
//         console.error(`Error ${isAddingCoach ? 'adding' : 'updating'} coach`, error);
//       }
//     }
//   };

//   const handleToggleSoftDelete = async (coach: Coach) => {
//     try {
//       const action = coach.softDelete ? 'restore' : 'delete';
//       await axios.post(`${Domain_URL}/coach/coaches/manage/${coach.coachId}`, { action });

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
//     navigate('/dashboard');
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

//       <Box sx={{ p: 2 }}>
        
//       </Box>

//       <TableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Phone Number</TableCell>
//               {/* <TableCell>Profession</TableCell> */}
//               <TableCell>Status</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedCoaches.map(coach => (
//               <TableRow key={coach.coachId}>
//                 <TableCell>{coach.name}</TableCell>
//                 <TableCell>{coach.email}</TableCell>
//                 <TableCell>{coach.phoneNumber}</TableCell>
//                 {/* <TableCell>{coach.profession}</TableCell> */}
//                 <TableCell>{coach.softDelete ? 'Inactive' : 'Active'}</TableCell>
//                 <TableCell>
//                   <button onClick={() => handleEdit(coach)}>Edit</button>
//                   <button onClick={() => handleToggleSoftDelete(coach)}>
//                     {coach.softDelete ? 'Undo Freeze' : 'Freeze Account'}
//                   </button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

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
//         <h2>{isAddingCoach ? 'Add Coach' : 'Edit Coach'}</h2>
//         <form onSubmit={handleSubmit}>
//           <input type="text" name="name" placeholder="Name" value={currentCoach?.name || ''} onChange={handleInputChange} required />
//           <input type="email" name="email" placeholder="Email" value={currentCoach?.email || ''} onChange={handleInputChange} required />
//           <input type="text" name="phoneNumber" placeholder="Phone Number" value={currentCoach?.phoneNumber || ''} onChange={handleInputChange} required />
//           <input type="text" name="profession" placeholder="Sport" value={currentCoach?.profession || ''} onChange={handleInputChange} required />
//           <input type="text" name="bio" placeholder="Bio" value={currentCoach?.bio || ''} onChange={handleInputChange} />
          
//           <button type="submit">{isAddingCoach ? 'Add Coach' : 'Update Coach'}</button>
//           <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default ManageCoach;










import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';
import { Domain_URL } from "../../config";
import { useNavigate } from 'react-router-dom';
import "./ManageCoach.css";

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
  softDelete: boolean;
  sport: string;
}

Modal.setAppElement('#root');

export default function Component() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [filteredCoaches, setFilteredCoaches] = useState<Coach[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(null);
  const [isAddingCoach, setIsAddingCoach] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  

  // State for storing validation error specific to the name field
const [nameError, setNameError] = useState<string | null>(null); 

  const [newCoach, setNewCoach] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    gender: '',
    sport: '',
    bio: '',
    password: '',
    emailVerified: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await axios.get(`${Domain_URL}/coach/getAllCoaches`);
        if (Array.isArray(response.data)) {
          const sortedCoaches = response.data.sort((a: Coach, b: Coach) =>
            a.name.localeCompare(b.name)
          );
          setCoaches(sortedCoaches);
          setFilteredCoaches(sortedCoaches);
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

  const handleEdit = (coach: Coach) => {
    setCurrentCoach(coach);
    setIsModalOpen(true);
    setIsAddingCoach(false);
  };

  const handleAddNewCoach = () => {
    setIsModalOpen(true);
    setIsAddingCoach(true);
  };

  const handleNewCoachInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    // Handle name validation
    if (name === 'name') {
      const alphanumericNameRegex = /^[a-zA-Z\s]*$/;
      if (!alphanumericNameRegex.test(value as string)) {
        setNameError('Name should contain only alphabets.');
      } else {
        setNameError(null);
      }
    }
    

    setNewCoach(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleNewCoachSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Domain_URL}/coach/createCoache`, newCoach);
      const updatedCoaches = [...coaches, response.data].sort((a, b) => a.name.localeCompare(b.name));
      setCoaches(updatedCoaches);
      setFilteredCoaches(updatedCoaches);
      setIsModalOpen(false);
      setNewCoach({
        name: '',
        email: '',
        phoneNumber: '',
        gender: '',
        sport: '',
        bio: '',
        password: '',
        emailVerified: false,
      });
    } catch (error) {
      console.error('Error adding new coach', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentCoach) {
      try {
        await axios.put(`${Domain_URL}/coach/update/${currentCoach.coachId}`, currentCoach);
        const updatedCoaches = coaches.map(coach => (coach.coachId === currentCoach.coachId ? currentCoach : coach)).sort((a, b) => a.name.localeCompare(b.name));
        setCoaches(updatedCoaches);
        setFilteredCoaches(updatedCoaches);
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error updating coach', error);
      }
    }
  };

  const handleToggleSoftDelete = async (coach: Coach) => {
    try {
      const action = coach.softDelete ? 'restore' : 'delete';
      await axios.post(`${Domain_URL}/coach/coaches/manage/${coach.coachId}`, { action });

      const updatedCoaches = coaches.map(c =>
        c.coachId === coach.coachId ? { ...c, softDelete: !c.softDelete } : c
      ).sort((a, b) => a.name.localeCompare(b.name));
      setCoaches(updatedCoaches);
      setFilteredCoaches(updatedCoaches);
    } catch (error) {
      console.error("Error toggling coach status", error);
    }
  };

  const goBackToDashboard = () => {
    navigate('/dashboard');
  };

// Handle select changes for gender selection
const handleSelectChange = (e: SelectChangeEvent<string>) => {
  const { name, value } = e.target;
  if (currentCoach && name) {
    setCurrentCoach({
      ...currentCoach,
      [name]: value,
    });
  }
};




  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const paginatedCoaches = filteredCoaches.slice(rowsPerPage, rowsPerPage + rowsPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement >) => {
    if (currentCoach) {
      setCurrentCoach({
        ...currentCoach,
        [e.target.name]: e.target.value,
      });
    }
  };


 
  
  

  return (
    <div className="p-4">
      <Button onClick={goBackToDashboard} startIcon={<FaArrowLeft />} variant="outlined" className="mb-4"
      sx={{
        backgroundColor: '#007bff',  // Set your custom blue color
        color: 'white',}}>
        Go Back to Dashboard
      </Button>
      <h2 className="text-2xl font-bold mb-4">Manage Coach</h2>

      <Button onClick={handleAddNewCoach} variant="contained" color="primary" className="mb-4">
        Add New Coach
      </Button>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
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
                <TableCell>{coach.softDelete ? 'Inactive' : 'Active'}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(coach)} variant="outlined" size="small" className="mr-2"
                    sx={{
                      backgroundColor: '#007bff',  // Set your custom blue color
                      color: 'white',}}>
                    Edit
                  </Button>
                  &nbsp;
                  <Button 
                    onClick={() => handleToggleSoftDelete(coach)} 
                    variant="outlined" 
                    color={coach.softDelete ? "primary" : "secondary"}
                    size="small"
                    sx={{
                      backgroundColor: '#007bff',  // Set your custom blue color
                      color: 'white',}}
                  >
                    {coach.softDelete ? 'Undo Freeze' : 'Freeze Account'}
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
        count={filteredCoaches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
       
      >
        {isAddingCoach ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Add New Coach</h2>
            <form onSubmit={handleNewCoachSubmit} className="space-y-4">
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={newCoach.name}
                onChange={handleNewCoachInputChange}
                required

                
              />
               {/* {/ Error message below TextField /} */}
      {nameError && (
        <Typography color="error" fontSize="sm" style={{ marginTop: '5px' }}>
          {nameError}
        </Typography>
      )}
              &nbsp;
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={newCoach.email}
                onChange={handleNewCoachInputChange}
                required
              />
              &nbsp;
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                value={newCoach.phoneNumber}
                onChange={handleNewCoachInputChange}
                required
              />
              &nbsp;
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={newCoach.gender}
                  onChange={handleNewCoachInputChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              &nbsp;
              <TextField
                fullWidth
                name="sport"
                label="Sport"
                value={newCoach.sport}
                onChange={handleNewCoachInputChange}
                required
              />
              &nbsp;
              <TextField
                fullWidth
                name="bio"
                label="Bio"
               
                value={newCoach.bio}
                onChange={handleNewCoachInputChange}
              />
              &nbsp;
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={newCoach.password}
                onChange={handleNewCoachInputChange}
                required
              />
              &nbsp;
              <FormControlLabel
                control={
                  <Switch
                    checked={newCoach.emailVerified}
                    onChange={(e) => setNewCoach(prev => ({ ...prev, emailVerified: e.target.checked }))}
                    name="emailVerified"
                  />
                }
                label="Email Verified"
              />
              <div className="flex justify-end space-x-2">
                <Button type="submit" variant="contained" color="primary"
                sx={{
                  backgroundColor: '#007bff',  // Set your custom blue color
                  color: 'white',}}>
                  Add Coach
                </Button>
                &nbsp;
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outlined"
                  sx={{
                    backgroundColor: '#007bff',  // Set your custom blue color
                    color: 'white',}}>
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Edit Coach</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={currentCoach?.name || ''}
                onChange={handleInputChange}
                required
              />
              &nbsp;
              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={currentCoach?.email || ''}
                onChange={handleInputChange}
                required
              />
              &nbsp;
              <TextField
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                value={currentCoach?.phoneNumber || ''}
                onChange={handleInputChange}
                required
              />
              &nbsp;
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={currentCoach?.gender || ''}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  
                </Select>
              </FormControl>
              &nbsp;
              <TextField
                fullWidth
                name="sport"
                label="Sport"
                value={currentCoach?.sport || ''}
                onChange={handleInputChange}
                required
              />
              &nbsp;
              <TextField
                fullWidth
                name="bio"
                label="Bio"
                
                value={currentCoach?.bio || ''}
                onChange={handleInputChange}
              />
              &nbsp;
              <div className="flex justify-end space-x-2">
                <Button type="submit" variant="contained" color="primary"
                sx={{
                  backgroundColor: '#007bff',  // Set your custom blue color
                  color: 'white',}}>
                  Update Coach
                </Button>
                &nbsp;
                <Button type="button" onClick={() => setIsModalOpen(false)} variant="outlined"
                  sx={{
                    backgroundColor: '#007bff',  // Set your custom blue color
                    color: 'white',}}>
                  Cancel
                </Button>
              </div>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
} 

function setEmailError(arg0: string | null) {
  throw new Error("Function not implemented.");
}
