import { useState } from 'react';
import { cancelTestJob, downloadResults } from '../../utils/testbedAPI';

const TestbedControls = ({ jobId, isLoading }) => {
  const [downloadFormat, setDownloadFormat] = useState('json');
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!jobId) {
    return null;
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadResults(jobId, downloadFormat);
    } catch (err) {
      console.error('Failed to download results:', err);
      alert('Failed to download results: ' + err.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this test job?')) {
      return;
    }
    
    try {
      await cancelTestJob(jobId);
      window.location.reload(); // Simple way to reset the page
    } catch (err) {
      console.error('Failed to cancel job:', err);
      alert('Failed to cancel job: ' + err.message);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <span className="text-sm text-gray-400">Test Job ID: </span>
          <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm">{jobId}</code>
        </div>
        
        <div className="flex mt-4 md:mt-0">
          {isLoading ? (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Cancel Test
            </button>
          ) : (
            <div className="flex items-center">
              <select
                value={downloadFormat}
                onChange={(e) => setDownloadFormat(e.target.value)}
                className="mr-2 bg-slate-200 font-normal text-gray-900 shadow-sm focus:ring-blue-500 focus:border-blue-500 block sm:text-sm border-gray-300 rounded-md"
                disabled={isDownloading}
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="pcap">PCAP</option>
              </select>
              
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className={`px-4 py-2 ${isDownloading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded`}
              >
                {isDownloading ? 'Downloading...' : 'Download Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestbedControls;
