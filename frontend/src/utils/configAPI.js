/**
 * Configuration API Utilities
 * Handles communication with the backend for configuration settings
 */

const API_BASE = 'https://netsentinel-raqp.onrender.com/api/config'; // Adjust this to your API base URL

/**
 * Get all threshold values
 * @returns {Promise<Object>} Threshold settings
 */

export const getThresholds = async () => {
    try {
      const response = await fetch(`${API_BASE}/thresholds`);
      
      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw API response:', responseText);
      
      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText);
        return data;
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response received:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Threshold fetch error:', error);
      throw error;
    }
  };

/**
 * Update a threshold value
 * @param {string} key - The threshold key to update
 * @param {number} value - The new threshold value
 * @returns {Promise<Object>} Updated threshold
 */
export const updateThreshold = async (key, value) => {
  const response = await fetch(`${API_BASE}/thresholds/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, value }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update threshold: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get all available rules
 * @returns {Promise<Array>} List of rule names
 */
export const getRules = async () => {
  const response = await fetch(`${API_BASE}/rules`);
  if (!response.ok) {
    throw new Error(`Failed to fetch rules: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get configuration for a specific rule
 * @param {string} ruleName - Name of the rule
 * @returns {Promise<Object>} Rule configuration
 */
export const getRuleConfig = async (ruleName) => {
  const response = await fetch(`${API_BASE}/rules/${ruleName}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch rule config: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Update the configuration for a specific rule
 * @param {string} ruleName - Name of the rule
 * @param {Object} config - New rule configuration
 * @returns {Promise<Object>} Updated configuration
 */
export const updateRuleConfig = async (ruleName, config) => {
  const response = await fetch(`${API_BASE}/rules/${ruleName}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update rule config: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get all system settings
 * @returns {Promise<Object>} All system settings
 */
export const getSettings = async () => {
  const response = await fetch(`${API_BASE}/settings`);
  if (!response.ok) {
    throw new Error(`Failed to fetch settings: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Update logging settings
 * @param {Object} settings - New logging settings
 * @returns {Promise<Object>} Updated logging settings
 */
export const updateLoggingSettings = async (settings) => {
  const response = await fetch(`${API_BASE}/settings/logging/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update logging settings: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Update alert settings
 * @param {Object} settings - New alert settings
 * @returns {Promise<Object>} Updated alert settings
 */
export const updateAlertSettings = async (settings) => {
  const response = await fetch(`${API_BASE}/settings/alerts/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update alert settings: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Test email alert configuration
 * @param {Object} emailConfig - Email configuration to test
 * @returns {Promise<Object>} Test result
 */
export const testEmailAlert = async (emailConfig) => {
  const response = await fetch(`${API_BASE}/settings/alerts/email/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailConfig),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to test email alert: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Test webhook alert configuration
 * @param {Object} webhookConfig - Webhook configuration to test
 * @returns {Promise<Object>} Test result
 */
export const testWebhookAlert = async (webhookConfig) => {
  const response = await fetch(`${API_BASE}/settings/alerts/webhook/test`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhookConfig),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to test webhook alert: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Get all available network interfaces
 * @returns {Promise<Array>} List of network interfaces
 */
export const getInterfaces = async () => {
  const response = await fetch(`${API_BASE}/settings/capture/interfaces`);
  if (!response.ok) {
    throw new Error(`Failed to fetch network interfaces: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Update capture settings
 * @param {Object} settings - New capture settings
 * @returns {Promise<Object>} Updated capture settings
 */
export const updateCaptureSettings = async (settings) => {
  const response = await fetch(`${API_BASE}/settings/capture/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update capture settings: ${response.statusText}`);
  }
  return response.json();
};

