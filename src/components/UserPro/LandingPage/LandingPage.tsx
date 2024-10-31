
import React, { useState } from 'react'
import { Typography, Container, Grid, Paper, Box, ThemeProvider, createTheme } from '@mui/material'
import { Person, PersonVcard, Headset } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498db',
    },
    secondary: {
      main: '#e74c3c',
    },
    success: {
      main: '#2ecc71',
    },
  },
})

interface RoleOption {
  name: string
  icon: React.ReactNode
  color: string
  hoverColor: string
  path: string
}

const roles: RoleOption[] = [
  { name: 'User', icon: <Person size={64} />, color: '#3498db', hoverColor: '#2980b9', path: '/user-login' },
  { name: 'Coach', icon: <PersonVcard size={64} />, color: '#e74c3c', hoverColor: '#c0392b', path: '/Coach-login' },
  { name: 'Admin', icon: <Headset size={64} />, color: '#2ecc71', hoverColor: '#27ae60', path: '/Adminlogin' },
]

export default function LandingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)
  const navigate = useNavigate();

  const handleRoleSelect = (role: RoleOption) => {
    setSelectedRole(role.name)
    setTimeout(() => {
      navigate(role.path);
    }, 2000)
  }

  const handleRoleHover = (role: string | null) => {
    setHoveredRole(role)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Container maxWidth="sm">
         <center><h3 style={{color:'black'}}> Note:-This app is designed for desktop/laptop use only </h3><br></br></center>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
            }}
          >
            <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ color: 'black' }}>
              I am
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {roles.map((role) => (
                <Grid item xs={4} key={role.name}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      backgroundColor: hoveredRole === role.name ? role.hoverColor : role.color,
                      transition: 'background-color 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                    onMouseEnter={() => handleRoleHover(role.name)}
                    onMouseLeave={() => handleRoleHover(null)}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <Box sx={{ color: 'black' }}>{role.icon}</Box>
                    <Typography variant="h6" component="h2" align="center" mt={2} sx={{ color: 'black' }}>
                      {role.name}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            {selectedRole && (
              <Box mt={4} p={2} bgcolor="rgba(255, 255, 255, 0.2)" borderRadius={2}>
                <Typography variant="h5" align="center" sx={{ color: 'black' }}>
                  You selected: {selectedRole}
                </Typography>
                <Typography variant="body1" align="center" mt={1} sx={{ color: 'black' }}>
                  Redirecting to Login Page ...
                </Typography>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  )
}