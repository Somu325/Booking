'use client';

import { useState } from 'react';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import {
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
  TextField,
  Typography,
  Box,
  FormGroup,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

type SlotType = 'General' | 'Personal';

interface Slot {
  date: Date;
  startTime: string;
  endTime: string;
  type: SlotType;
  comment?: string;
}

export default function Generateslots() {
  const [slotType, setSlotType] = useState<SlotType>('General');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [dateRange] = useState<[Date | null, Date | null]>([new Date(), addDays(new Date(), 7)]);
  const [comment, setComment] = useState('');
  const [generatedSlots, setGeneratedSlots] = useState<Slot[]>([]);

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const weekends = ['Saturday', 'Sunday'];

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generateSlots = () => {
    if (!dateRange[0] || !dateRange[1]) return;

    const slots: Slot[] = [];
    const interval = eachDayOfInterval({ start: dateRange[0], end: dateRange[1] });

    interval.forEach((date) => {
      const dayName = format(date, 'EEEE');
      if (selectedDays.includes(dayName)) {
        slots.push({
          date: date,
          startTime,
          endTime,
          type: slotType,
          comment: slotType === 'Personal' ? comment : undefined,
        });
      }
    });

    setGeneratedSlots(slots);
    alert(`Generated ${slots.length} slots!`); // Alert showing number of slots generated
  };

  const saveSlots = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/slot/create-weekly-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startdate: dateRange[0],
          enddate: dateRange[1],
          daysOfWeek: selectedDays,
          slots: generatedSlots,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save slots');
      }

      const data = await response.json();
      console.log('Slots saved successfully:', data);
      alert('Slots saved successfully!'); // Alert on success
      // Optionally reset form fields after success
      setSelectedDays([]);
      setGeneratedSlots([]);
      setComment('');
    } catch (error) {
      console.error('Error saving slots:', error);
      // alert('Error saving slots: ' + error.message);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    saveSlots();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f0f4f8',
          padding: 3,
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 400,
            backgroundColor: '#ffffff',
            boxShadow: 2,
            padding: 2,
          }}
        >
          <CardContent sx={{ fontSize: '1rem', lineHeight: '1.5' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <FormControl fullWidth>
                <InputLabel>Slot Type</InputLabel>
                <Select
                  value={slotType}
                  onChange={(e) => setSlotType(e.target.value as SlotType)}
                  label="Slot Type"
                >
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Personal">Personal</MenuItem>
                </Select>
              </FormControl>

              {slotType === 'Personal' && (
                <TextField
                  fullWidth
                  label="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  multiline
                  rows={2}
                  inputProps={{ maxLength: 25 }}
                />
              )}

              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />

              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />

              <Typography variant="h6">Weekdays</Typography>
              <FormGroup>
                {weekdays.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>

              <Typography variant="h6">Weekends</Typography>
              <FormGroup>
                {weekends.map((day) => (
                  <FormControlLabel
                    key={day}
                    control={
                      <Checkbox
                        checked={selectedDays.includes(day)}
                        onChange={() => handleDayToggle(day)}
                      />
                    }
                    label={day}
                  />
                ))}
              </FormGroup>

              {/* <DateRangePicker
                value={dateRange}
                onChange={(newValue: [Date | null, Date | null]) => setDateRange(newValue)}
                renderInput={(startProps:any, endProps:any) => (
                  <>
                    <TextField {...startProps} fullWidth />
                    <TextField {...endProps} fullWidth sx={{ mt: 1 }} />
                  </>
                )}
              /> */}

              <Button variant="contained" onClick={generateSlots} fullWidth sx={{ mt: 2 }}>
                Generate Slots
              </Button>

              <Button variant="contained" onClick={handleSubmit} fullWidth sx={{ mt: 2 }}>
                Save Slots
              </Button>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Generated Slots: {generatedSlots.length}
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
                {generatedSlots.map((slot, index) => (
                  <Typography component="li" key={index} variant="body2">
                    Date: {format(slot.date, 'yyyy-MM-dd')} | Day: {format(slot.date, 'EEEE')} |
                    Start: {slot.startTime} | End: {slot.endTime} | Type: {slot.type}
                    {slot.comment && ` | Comment: ${slot.comment}`}
                  </Typography>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
}
