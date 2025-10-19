import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import RouteGenerator from './components/RouteGenerator'
import RouteResults from './components/RouteResults'

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Free-form Text to Route
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<RouteGenerator />} />
          <Route path="/results" element={<RouteResults />} />
        </Routes>
      </Container>
    </Box>
  )
}

export default App
