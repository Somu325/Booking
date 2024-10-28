import React, { useState } from 'react';
import axios from 'axios';
import { Domain_URL  } from '../../config';

import {
  Button,
  Popover,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Alert,
} from '@mui/material';
//import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {  CircularProgress } from '@mui/joy';

interface Child {
  id: string; // Adjust according to your child object structure
  name: string; // Adjust according to your child object structure
}


const CombinedApp: React.FC = () => {
 // const [startDate, setStartDate] = useState<Date | null>(null);

  //const [endDate, setEndDate] = useState<Date | null>(null);
  const [anchorElStart, setAnchorElStart] = useState<null | HTMLElement>(null);
  const [anchorElEnd, setAnchorElEnd] = useState<null | HTMLElement>(null);
 
 const [children, setChildren] = useState([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [selectedChild, setSelectedChild] = useState<string | null>('');
  const handleStartDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElStart(event.currentTarget);
  };

  const handleEndDateClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElEnd(event.currentTarget);
  };

    // Adjust the function to match the expected signature
   {/*} const handleCloseStart = (value: Date | Date[], _event: React.MouseEvent<HTMLButtonElement>) => {
      // Check if the value is an array or a single date
      if (Array.isArray(value)) {
        setStartDate(value[0]); // If it's an array, take the first date
      } else {
        setStartDate(value); // If it's a single date, set it directly
      }
    };*/}

 {/*} const handleCloseEnd = (value: Date | Date[] | null) => {
    if (value && !Array.isArray(value)) {
      setEndDate(value);
    }
    setAnchorElEnd(null);
  };*/}

  const openStart = Boolean(anchorElStart);
  const openEnd = Boolean(anchorElEnd);

  const fetchAllChildren = async () => {
    setLoading(true);
    setError(null); // Reset error state before making the request
    try {
      const response = await axios.get(`${Domain_URL}/children/user/58e31403-ec9c-4fd8-b1a2-79678b54d22b`);
      console.log("Response data:", response.data);
      setChildren(response.data);
    } catch (error) {
      console.error("Error fetching all children:", error);
      //setError("Failed to fetch children data."); 
    } finally {
      setLoading(false);
    }
  };
 
    
 
  {loading && <CircularProgress />}

      {/* Show error message if there is an error */}
      {error && <Alert severity="error">{error}</Alert>}
  

  return (
    <div className="calendar-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="button-container" style={{ marginBottom: '20px' }}>
        <Button
          variant="contained"
          style={{ backgroundColor: '#1976d2', color: 'white', fontSize: 'medium', marginRight: '10px' }}
          onClick={handleStartDateClick}
        >
          Select Start Date
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: '#1976d2', color: 'white', fontSize: 'medium' }}
          onClick={handleEndDateClick}
        >
          Select End Date
        </Button>

        <Button onClick={fetchAllChildren}>Get All Children</Button>
        
      </div>

      <Popover
        open={openStart}
        anchorEl={anchorElStart}
        onClose={() => setAnchorElStart(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
       <Typography>
 {/*<Calendar onChange={handleCloseStart} value={startDate} /> */}
</Typography>
      </Popover>

      <Popover
        open={openEnd}
        anchorEl={anchorElEnd}
        onClose={() => setAnchorElEnd(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography>
          {/*<Calendar onChange={handleCloseEnd} value={endDate} />*/}
        </Typography>
      </Popover>
      <TableContainer component={Paper} style={{ marginTop: '20px', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', padding: '16px', borderRight: '1px solid white' }}>
                Start Date
              </TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', padding: '16px', borderRight: '1px solid white' }}>
                End Date
              </TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: 'white', padding: '16px' }}>
                Child Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Row for Dates */}
            <TableRow>
              <TableCell sx={{ padding: '16px', borderRight: '1px solid #ccc' }}>
               {/* {startDate?.toLocaleDateString()}*/}
              </TableCell>
              <TableCell sx={{ padding: '16px', borderRight: '1px solid #ccc' }}>
                {/*{endDate?.toLocaleDateString()}*/}
              </TableCell>
              <TableCell sx={{ padding: '16px' }}>
                {/* Dropdown for selecting child name */}
                <FormControl fullWidth>
                  <InputLabel id="child-select-label">Select Child</InputLabel>
                  <Select
                    labelId="child-select-label"
                    value={selectedChild}
                    onChange={(e) => setSelectedChild(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>Select a child</MenuItem>
                    {children.map((child: Child) => ( // Use Child type here
                      <MenuItem key={child.id} value={child.name}>
                        {child.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
            </TableRow>

            {/* Rows for Children Data (if needed) */}
            {/* Additional rows can be added here based on requirements */}
          </TableBody>
        </Table>
      </TableContainer>

     
    </div>
  );
};

export default CombinedApp;
