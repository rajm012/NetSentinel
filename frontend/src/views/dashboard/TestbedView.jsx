import { useState } from 'react';
import PacketUploader from '../../components/testbed/PacketUploader';
import TestResults from '../../components/testbed/TestResults';
import PacketGenerator from '../../components/testbed/PacketGenerator';
import TestbedControls from '../../components/testbed/TestbedControls';
import { uploadPcap, getTestResults, generateTraffic } from '../../utils/testbedAPI';

const TestbedView = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testJobId, setTestJobId] = useState(null);
  const [manualJobId, setManualJobId] = useState('');

  const handlePcapUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await uploadPcap(file);
      setTestJobId(response.jobId);
      checkTestResults(response.jobId);
    } catch (err) {
      setError('Failed to upload PCAP file: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleGenerateTraffic = async (config) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateTraffic(config);
      setTestJobId(response.jobId);
      checkTestResults(response.jobId);
    } catch (err) {
      setError('Failed to generate traffic: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleManualJobIdSubmit = async (e) => {
    e.preventDefault();
    if (!manualJobId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      setTestJobId(manualJobId);
      await checkTestResults(manualJobId);
    } catch (err) {
      setError('Failed to fetch results: ' + err.message);
      setIsLoading(false);
    }
  };

  const checkTestResults = async (jobId) => {
    try {
      const results = await getTestResults(jobId);
      if (results.status === 'completed') {
        setTestResults(results);
        setIsLoading(false);
        setActiveTab('results');
      } else if (results.status === 'processing') {
        setTimeout(() => checkTestResults(jobId), 2000);
      } else {
        setError('Test job failed: ' + (results.error || 'Unknown error'));
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to get test results: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Packet Testbed</h1>
      
      {/* Job ID Display and Input Section */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {testJobId && (
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-medium text-gray-700 mb-1">Current Job ID</p>
              <div className="flex items-center gap-2">
                <code className="bg-gray-200 text-gray-900 px-3 py-2 rounded text-sm break-all">
                  {testJobId}
                </code>
                <button 
                  onClick={() => navigator.clipboard.writeText(testJobId)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleManualJobIdSubmit} className="flex-1 min-w-[200px]">
            <label htmlFor="jobIdInput" className="text-sm font-medium text-gray-700 mb-1 block">
              Enter Job ID
            </label>
            <div className="flex gap-2">
              <input
                id="jobIdInput"
                type="text"
                value={manualJobId}
                onChange={(e) => setManualJobId(e.target.value)}
                placeholder="Paste job ID here"
                className="flex-1 px-3 py-2 text-gray-900 border rounded-md text-sm"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Fetch
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 mr-4 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            PCAP Upload
          </button>
          <button
            className={`px-4 py-2 mr-4 ${activeTab === 'generate' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => setActiveTab('generate')}
          >
            Traffic Generator
          </button>
          {testResults && (
            <button
              className={`px-4 py-2 ${activeTab === 'results' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              Test Results
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'upload' && (
          <PacketUploader onUpload={handlePcapUpload} isLoading={isLoading} />
      )}

      {activeTab === 'generate' && (
        <PacketGenerator onGenerate={handleGenerateTraffic} isLoading={isLoading} />
      )}

      {activeTab === 'results' && testResults && (
        <TestResults results={testResults} />
      )}

      {/* Status Indicators */}
      {isLoading && (
        <div className="bg-blue-50 p-4 rounded mt-4">
          <p className="flex items-center font-medium text-blue-700">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing packet data... This may take a few moments.
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 p-4 rounded mt-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <TestbedControls jobId={testJobId} isLoading={isLoading} />
    </div>
  );
};

export default TestbedView;
