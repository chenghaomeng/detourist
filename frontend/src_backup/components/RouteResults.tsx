import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material'
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { RouteScore } from '../types'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const RouteResults: React.FC = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState<any>(null)
  const [selectedRoute, setSelectedRoute] = useState<RouteScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('routeResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
      setLoading(false)
    } else {
      navigate('/')
    }
  }, [navigate])

  const handleRouteSelect = (route: RouteScore) => {
    setSelectedRoute(route)
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.round(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}m`
  }

  const formatDistance = (meters: number): string => {
    const km = meters / 1000
    if (km >= 1) {
      return `${km.toFixed(1)} km`
    }
    return `${meters.toFixed(0)} m`
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (!results || !results.routes || results.routes.length === 0) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No routes were generated. Please try again with a different prompt.
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Try Again
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Generated Routes
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Processing time: {results.processing_time_seconds.toFixed(2)} seconds
      </Typography>

      <Grid container spacing={3}>
        {/* Route List */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Available Routes (Ranked by Score)
          </Typography>
          
          {results.routes.map((route: RouteScore, index: number) => (
            <Card 
              key={index} 
              sx={{ mb: 2, cursor: 'pointer' }}
              onClick={() => handleRouteSelect(route)}
              variant={selectedRoute === route ? 'elevation' : 'outlined'}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Route #{index + 1}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Score: ${route.overall_score.toFixed(2)}`} 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={formatDuration(route.route.total_duration_seconds)} 
                    color="secondary" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={formatDistance(route.route.total_distance_meters)} 
                    color="default" 
                    size="small" 
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Waypoints: {route.route.waypoints.length}
                </Typography>
                
                {route.route.waypoints.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Via: {route.route.waypoints.map(w => w.name).join(', ')}
                  </Typography>
                )}
              </CardContent>
              
              <CardActions>
                <Button size="small" onClick={() => handleRouteSelect(route)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))}
        </Grid>

        {/* Map */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Route Map
          </Typography>
          
          <Paper sx={{ height: '500px', overflow: 'hidden' }}>
            {selectedRoute ? (
              <MapContainer
                center={[selectedRoute.route.origin.latitude, selectedRoute.route.origin.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                {/* Origin Marker */}
                <Marker position={[selectedRoute.route.origin.latitude, selectedRoute.route.origin.longitude]}>
                  <Popup>Start</Popup>
                </Marker>
                
                {/* Destination Marker */}
                <Marker position={[selectedRoute.route.destination.latitude, selectedRoute.route.destination.longitude]}>
                  <Popup>End</Popup>
                </Marker>
                
                {/* Waypoint Markers */}
                {selectedRoute.route.waypoints.map((waypoint, index) => (
                  <Marker key={index} position={[waypoint.coordinates.latitude, waypoint.coordinates.longitude]}>
                    <Popup>{waypoint.name}</Popup>
                  </Marker>
                ))}
                
                {/* Route Polyline */}
                {selectedRoute.route.segments.map((segment, index) => (
                  <Polyline
                    key={index}
                    positions={[
                      [segment.start.latitude, segment.start.longitude],
                      [segment.end.latitude, segment.end.longitude]
                    ]}
                    color="blue"
                    weight={3}
                  />
                ))}
              </MapContainer>
            ) : (
              <Box 
                display="flex" 
                justifyContent="center" 
                alignItems="center" 
                height="100%"
                color="text.secondary"
              >
                Select a route to view on map
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Route Details */}
      {selectedRoute && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Route Details
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Scoring Breakdown
                </Typography>
                <Typography variant="body2">
                  CLIP Score: {selectedRoute.clip_score.toFixed(3)}
                </Typography>
                <Typography variant="body2">
                  Efficiency Score: {selectedRoute.efficiency_score.toFixed(3)}
                </Typography>
                <Typography variant="body2">
                  Preference Match: {selectedRoute.preference_match_score.toFixed(3)}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Overall Score: {selectedRoute.overall_score.toFixed(3)}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Route Statistics
                </Typography>
                <Typography variant="body2">
                  Total Distance: {formatDistance(selectedRoute.route.total_distance_meters)}
                </Typography>
                <Typography variant="body2">
                  Total Duration: {formatDuration(selectedRoute.route.total_duration_seconds)}
                </Typography>
                <Typography variant="body2">
                  Number of Waypoints: {selectedRoute.route.waypoints.length}
                </Typography>
                <Typography variant="body2">
                  Segments: {selectedRoute.route.segments.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Applied Constraints
                </Typography>
                {Object.entries(selectedRoute.route.constraints_applied).map(([constraint, applied]) => (
                  <Chip
                    key={constraint}
                    label={constraint}
                    color={applied ? "success" : "default"}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Generate New Route
        </Button>
      </Box>
    </Box>
  )
}

export default RouteResults
