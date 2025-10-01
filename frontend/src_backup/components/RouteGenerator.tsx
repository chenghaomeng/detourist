import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { apiService } from '../services/api'

interface RouteFormData {
  userPrompt: string
  maxResults: number
}

const RouteGenerator: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors } } = useForm<RouteFormData>({
    defaultValues: {
      userPrompt: '',
      maxResults: 5
    }
  })

  const onSubmit = async (data: RouteFormData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.generateRoutes(data.userPrompt, data.maxResults)
      
      // Store results in sessionStorage for the results page
      sessionStorage.setItem('routeResults', JSON.stringify(response))
      
      // Navigate to results page
      navigate('/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Generate Your Custom Route
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        Describe your ideal route in natural language. Include your starting point, destination, 
        preferences (like scenic views, avoiding stairs, or specific landmarks), and how much 
        extra time you're willing to spend for a better route.
      </Typography>

      <Paper sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register('userPrompt', { required: 'Please describe your desired route' })}
            label="Describe your route"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="e.g., I want to go from Central Park to Times Square, taking a scenic route with lots of greenery. I'm willing to spend an extra 15 minutes for a better route."
            error={!!errors.userPrompt}
            helperText={errors.userPrompt?.message}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Maximum Results</InputLabel>
            <Select
              {...register('maxResults')}
              defaultValue={5}
              label="Maximum Results"
            >
              <MenuItem value={3}>3 routes</MenuItem>
              <MenuItem value={5}>5 routes</MenuItem>
              <MenuItem value={10}>10 routes</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            fullWidth
          >
            {loading ? 'Generating Routes...' : 'Generate Routes'}
          </Button>
        </form>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Example Prompts
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <li>
            <Typography variant="body2" color="text.secondary">
              "Take me from Union Square to Golden Gate Park, avoiding hills and stairs. I want to see some art galleries along the way."
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              "I need to get from my hotel near Times Square to Central Park, but I'd love a route that passes by some good coffee shops. I can spare 20 extra minutes."
            </Typography>
          </li>
          <li>
            <Typography variant="body2" color="text.secondary">
              "Route from downtown to the waterfront, avoiding tolls and preferring quiet streets over busy roads."
            </Typography>
          </li>
        </Box>
      </Box>
    </Box>
  )
}

export default RouteGenerator
