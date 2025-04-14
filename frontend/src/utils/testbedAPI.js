// src/utils/testbedAPI.js

// Base API URL - you can replace this with your actual backend URL
const API_BASE_URL = 'http://localhost:8000/api/testbed';

/**
 * Upload a PCAP file for analysis
 * 
 * @param {File} file - The PCAP file to upload
 * @returns {Promise<Object>} - Response with job ID
 */

export const uploadPcap = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:8000/api/testbed/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }
      return await response.json();
    } 

    catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
};


/**
 * Generate synthetic traffic for testing
 * 
 * @param {Object} config - Traffic generation configuration
 * @returns {Promise<Object>} - Response with job ID
 */
export async function generateTraffic(config) {
  const response = await fetch(`http://localhost:8000/api/testbed/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate traffic');
  }
  
  return response.json();
}

/**
 * Get the results of a test job
 * 
 * @param {string} jobId - ID of the test job
 * @returns {Promise<Object>} - Test results
 */
export async function getTestResults(jobId) {
  const response = await fetch(`http://localhost:8000/api/testbed/results/${jobId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get test results');
  }
  
  return response.json();
}

/**
 * Cancel an in-progress test job
 * 
 * @param {string} jobId - ID of the test job to cancel
 * @returns {Promise<Object>} - Response with status
 */
export async function cancelTestJob(jobId) {
  const response = await fetch(`http://localhost:8000/api/testbed/cancel/${jobId}`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel test job');
  }
  
  return response.json();
}

/**
 * Download test results in the specified format
 * 
 * @param {string} jobId - ID of the test job
 * @param {string} format - Format to download (json, csv, pcap)
 */


// Improved downloadResults function for testbedAPI.js
export async function downloadResults(jobId, format) {
    try {
      console.log(`Requesting download: ${jobId} format: ${format}`);
      
      const response = await fetch(`http://localhost:8000/api/testbed/download/${jobId}?format=${format}`, {
        method: 'GET',
        headers: {
          'Accept': format === 'json' ? 'application/json' : 
                   format === 'csv' ? 'text/csv' : 
                   'application/octet-stream'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Failed to download with status: ${response.status}`;
        
        // Try to parse error message from server
        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch (parseError) {
          console.warn('Could not parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `results-${jobId}.${format}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]*)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a blob from the response data
      const blob = await response.blob();
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
}
