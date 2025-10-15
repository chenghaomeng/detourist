import axios from 'axios'

const API_BASE_URL = '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for route generation (Ollama can be slow)
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface RouteGenerationRequest {
  user_prompt: string
  max_results: number
  num_tags: number
}

export interface RouteGenerationResponse {
  routes: any[]
  processing_time_seconds: number
  metadata: {
    total_routes_generated: number
    waypoints_found: number
    search_zone_area_km2: number
  }
}

export const apiService = {
  async generateRoutes(userPrompt: string, maxResults: number = 5, numTags: number = 5): Promise<RouteGenerationResponse> {
    try {
      console.log('Making request to:', API_BASE_URL + '/generate-routes')
      console.log('Request data:', { user_prompt: userPrompt, max_results: maxResults, num_tags: numTags })
      
      const response = await apiClient.post<RouteGenerationResponse>('/generate-routes', {
        user_prompt: userPrompt,
        max_results: maxResults,
        num_tags: numTags,
      })
      
      console.log('Response received:', response.data)
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Server error: ${error.response.data.detail || error.response.statusText}`)
        } else if (error.request) {
          throw new Error('Network error: Unable to connect to server')
        }
      }
      throw new Error('An unexpected error occurred')
    }
  },

  async healthCheck(): Promise<{ status: string; modules: Record<string, string> }> {
    try {
      const response = await apiClient.get('/health')
      return response.data
    } catch (error) {
      throw new Error('Health check failed')
    }
  },
}
