import React, { useState } from 'react';
import { updateAlertSettings, testEmailAlert, testWebhookAlert } from '../../utils/configAPI';

const AlertConfig = ({ alertSettings }) => {
  const [settings, setSettings] = useState({
    enableEmail: alertSettings.enableEmail || false,
    emailRecipients: alertSettings.emailRecipients || '',
    emailServer: alertSettings.emailServer || '',
    emailPort: alertSettings.emailPort || 587,
    emailUsername: alertSettings.emailUsername || '',
    emailPassword: alertSettings.emailPassword || '',
    emailSecurity: alertSettings.emailSecurity || 'tls',
    
    enableWebhook: alertSettings.enableWebhook || false,
    webhookUrl: alertSettings.webhookUrl || '',
    webhookHeaders: alertSettings.webhookHeaders || '{}',
    
    minSeverity: alertSettings.minSeverity || 'medium',
    throttleTime: alertSettings.throttleTime || 300,
    
    enableDesktopNotifications: alertSettings.enableDesktopNotifications || true,
  });
  
  const [testResult, setTestResult] = useState({ type: '', message: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [testing, setTesting] = useState({ email: false, webhook: false });

  const handleChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      await updateAlertSettings(settings);
      setMessage({
        type: 'success',
        text: 'Alert configuration saved successfully'
      });
    } catch (err) {
      console.error('Error saving alert settings:', err);
      setMessage({
        type: 'error',
        text: `Failed to save settings: ${err.message}`
      });
    } finally {
      setSaving(false);
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };

  const handleTestEmail = async () => {
    setTesting({ ...testing, email: true });
    setTestResult({ type: 'info', message: 'Sending test email...' });
    
    try {
      const result = await testEmailAlert({
        emailRecipients: settings.emailRecipients,
        emailServer: settings.emailServer,
        emailPort: settings.emailPort,
        emailUsername: settings.emailUsername,
        emailPassword: settings.emailPassword,
        emailSecurity: settings.emailSecurity
      });
      
      setTestResult({ 
        type: 'success', 
        message: 'Test email sent successfully!' 
      });
    } catch (err) {
      console.error('Error sending test email:', err);
      setTestResult({ 
        type: 'error', 
        message: `Failed to send test email: ${err.message}` 
      });
    } finally {
      setTesting({ ...testing, email: false });
      
      setTimeout(() => {
        setTestResult({ type: '', message: '' });
      }, 5000);
    }
  };

  const handleTestWebhook = async () => {
    setTesting({ ...testing, webhook: true });
    setTestResult({ type: 'info', message: 'Sending test webhook...' });
    
    try {
      await testWebhookAlert({
        webhookUrl: settings.webhookUrl,
        webhookHeaders: JSON.parse(settings.webhookHeaders)
      });
      
      setTestResult({ 
        type: 'success', 
        message: 'Test webhook sent successfully!' 
      });
    } catch (err) {
      console.error('Error sending test webhook:', err);
      setTestResult({ 
        type: 'error', 
        message: `Failed to send test webhook: ${err.message}` 
      });
    } finally {
      setTesting({ ...testing, webhook: false });
      
      setTimeout(() => {
        setTestResult({ type: '', message: '' });
      }, 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Alert Configuration</h2>
        <p className="text-gray-600">Configure how you want to be notified about detected threats</p>
      </div>
      
      {/* Status Messages */}
      <div className="space-y-3">
        {message.text && (
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}
        
        {testResult.message && (
          <div className={`p-4 rounded-lg border ${
            testResult.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : testResult.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-700' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <div className="flex items-center">
              {testResult.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : testResult.type === 'error' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              <span>{testResult.message}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* General Settings Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">General Settings</h3>
        
        <div className="space-y-5">
          {/* Minimum Alert Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Alert Severity
            </label>
            <select
              value={settings.minSeverity}
              onChange={(e) => handleChange('minSeverity', e.target.value)}
              className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
            >
              <option value="low">Low (All alerts)</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical only</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Only alerts with this severity level or higher will trigger notifications
            </p>
          </div>
          
          {/* Alert Throttling */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alert Throttling (seconds)
            </label>
            <input
              type="number"
              min="0"
              max="3600"
              value={settings.throttleTime}
              onChange={(e) => handleChange('throttleTime', parseInt(e.target.value, 10))}
              className="block w-full rounded-lg text-gray-950 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum time between repeated alerts of the same type (0 to disable throttling)
            </p>
          </div>
          
          {/* Desktop Notifications */}
          <div className="flex items-center">
            <input
              id="enableDesktopNotifications"
              type="checkbox"
              checked={settings.enableDesktopNotifications}
              onChange={(e) => handleChange('enableDesktopNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="enableDesktopNotifications" className="ml-2 block text-sm text-gray-700">
              Enable desktop notifications
            </label>
          </div>
        </div>
      </div>
      
      {/* Email Alerts Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
          <input
            id="enableEmail"
            type="checkbox"
            checked={settings.enableEmail}
            onChange={(e) => handleChange('enableEmail', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableEmail" className="ml-2 text-lg font-semibold text-gray-800">
            Email Alerts
          </label>
        </div>
        
        {settings.enableEmail && (
          <div className="mt-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Recipients
              </label>
              <input
                type="text"
                value={settings.emailRecipients}
                onChange={(e) => handleChange('emailRecipients', e.target.value)}
                placeholder="email1@example.com, email2@example.com"
                className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              />
              <p className="mt-1 text-xs text-gray-500">
                Comma-separated list of email addresses
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Server
                </label>
                <input
                  type="text"
                  value={settings.emailServer}
                  onChange={(e) => handleChange('emailServer', e.target.value)}
                  placeholder="smtp.example.com"
                  className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <input
                  type="number"
                  value={settings.emailPort}
                  onChange={(e) => handleChange('emailPort', parseInt(e.target.value, 10))}
                  className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={settings.emailUsername}
                  onChange={(e) => handleChange('emailUsername', e.target.value)}
                  className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={settings.emailPassword}
                  onChange={(e) => handleChange('emailPassword', e.target.value)}
                  className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Connection Security
              </label>
              <select
                value={settings.emailSecurity}
                onChange={(e) => handleChange('emailSecurity', e.target.value)}
                className="block w-full rounded-lg bg-white text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              >
                <option value="none">None</option>
                <option value="ssl">SSL</option>
                <option value="tls">TLS</option>
                <option value="starttls">STARTTLS</option>
              </select>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleTestEmail}
                disabled={testing.email || !settings.emailServer || !settings.emailRecipients}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                  testing.email || !settings.emailServer || !settings.emailRecipients 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                } transition duration-150`}
              >
                {testing.email ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Send Test Email
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Webhook Alerts Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center mb-4 pb-2 border-b border-gray-100">
          <input
            id="enableWebhook"
            type="checkbox"
            checked={settings.enableWebhook}
            onChange={(e) => handleChange('enableWebhook', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableWebhook" className="ml-2 text-lg font-semibold text-gray-800">
            Webhook Alerts
          </label>
        </div>
        
        {settings.enableWebhook && (
          <div className="mt-4 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                value={settings.webhookUrl}
                onChange={(e) => handleChange('webhookUrl', e.target.value)}
                placeholder="https://example.com/webhook"
                className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-150"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Headers (JSON)
              </label>
              <textarea
                value={settings.webhookHeaders}
                onChange={(e) => handleChange('webhookHeaders', e.target.value)}
                placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
                rows={4}
                className="block w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono text-sm transition duration-150"
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional HTTP headers in JSON format
              </p>
            </div>
            
            <div className="pt-2">
              <button
                onClick={handleTestWebhook}
                disabled={testing.webhook || !settings.webhookUrl}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                  testing.webhook || !settings.webhookUrl
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                } transition duration-150`}
              >
                {testing.webhook ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    Send Test Webhook
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm ${
            saving
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          } transition duration-150`}
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Save Alert Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AlertConfig;
