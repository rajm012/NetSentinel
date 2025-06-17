import { useState, useCallback } from 'react';

const BASE_URL = 'https://netsentinel-raqp.onrender.com';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

async function fetchApi(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${normalizedEndpoint}`;

  const config = {
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Helper function to create FormData for multipart requests
function createFormData(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (endpoint, options = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchApi(endpoint, options);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Specialized multipart form data post
  const postFormData = useCallback(async (endpoint, formData, extraHeaders = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchApi(endpoint, {
        method: 'POST',
        headers: {
          ...extraHeaders,
        },
        body: formData,
      });
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    get: (endpoint, options = {}) => callApi(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options = {}) =>
      callApi(endpoint, { 
        ...options, 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        body: JSON.stringify(body),
      }),
    postFormData, // Export the specialized form data post
    put: (endpoint, body, options = {}) =>
      callApi(endpoint, { ...options, method: 'PUT', body }),
    delete: (endpoint, options = {}) =>
      callApi(endpoint, { ...options, method: 'DELETE' }),
    isLoading,
    error,
  };
}

// Specific API methods for threat detection
export const threatApi = {
  detectAnomalies: async (file, thresholds) => {
    const formData = createFormData({
      file,
      syn_threshold: thresholds?.synThreshold || 100,
      port_threshold: thresholds?.portThreshold || 20,
      dns_min_subdomains: thresholds?.dnsMinSubdomains || 5,
      dns_min_length: thresholds?.dnsMinLength || 50,
    });
    return fetchApi('/api/detect/anomalies', {
      method: 'POST',
      body: formData,
    });
  },

  detectBehavior: async (file, params) => {
    const formData = createFormData({
      file,
      conn_limit: params?.connLimit || 100,
      window: params?.window || 10,
      bw_threshold: params?.bwThreshold || 1000000,
      timing_threshold: params?.timingThreshold || 0.001,
    });
    return fetchApi('/api/detect/behavior', {
      method: 'POST',
      body: formData,
    });
  },

  detectFingerprints: async (file) => {
    const formData = createFormData({ file });
    return fetchApi('/api/detect/fingerprints', {
      method: 'POST',
      body: formData,
    });
  },

  detectThreats: async (file) => {
    const formData = createFormData({ file });
    return fetchApi('/api/detect/threats', {
      method: 'POST',
      body: formData,
    });
  },
};

export default fetchApi;
