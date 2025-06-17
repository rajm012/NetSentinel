export async function fetchApi(endpoint, options = {}) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://netsentinel-raqp.onrender.com'
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    const config = {
      ...options,
      headers
    }
    
    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, config)
      
      if (!response.ok) {
        const error = new Error(response.statusText)
        error.response = response
        throw error
      }
      
      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
}
