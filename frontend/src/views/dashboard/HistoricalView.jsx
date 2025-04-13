import { useState } from 'react';
import { 
  startLiveSniffer, 
  stopLiveSniffer,
  getLiveSnifferStatus,
  getLiveSnifferResults,
  listActiveSniffers,
  deleteLiveSniffer,
  analyzePcap,
  getPcapAnalysisStatus,
  getPcapAnalysisResults,
  getPcapAnalysisSummary,
  deletePcapAnalysis,
  parseWithTshark
} from '../../utils/hispi';

export default function HistoricalView() {
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pcap');
  const [snifferStatus, setSnifferStatus] = useState(null);
  const [snifferResults, setSnifferResults] = useState([]);
  const [pcapFile, setPcapFile] = useState(null);
  const [pcapName, setPcapName] = useState('');
  const [tsharkFile, setTsharkFile] = useState(null);
  const [tsharkResults, setTsharkResults] = useState(null);
  const [pcapAnalysisId, setPcapAnalysisId] = useState(null);
  const [pcapAnalysisStatus, setPcapAnalysisStatus] = useState(null);
  const [pcapAnalysisResults, setPcapAnalysisResults] = useState([]);
  const [pcapAnalysisSummary, setPcapAnalysisSummary] = useState(null);
  const [pcapLimit, setPcapLimit] = useState(100);
  const [pcapOffset, setPcapOffset] = useState(0);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        iface: "Wi-Fi",
        filters: ["tcp", "port 80"],
        name: "HTTP Traffic Monitor"
      };

      const response = await startLiveSniffer(config);
      setSessionId(response.id);
      setActiveTab('sniffer'); // Switch to Sniffer Stuffs tab after starting
    } catch (err) {
      console.error('Error starting session:', err);
      setError('Failed to start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStopSession = async () => {
    try {
      setLoading(true);
      setError(null);
      await stopLiveSniffer(sessionId);
      setSessionId(null);
      setSnifferStatus(null);
      setSnifferResults([]);
    } catch (err) {
      console.error('Error stopping session:', err);
      setError('Failed to stop session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteLiveSniffer(sessionId);
      setSessionId(null);
      setSnifferStatus(null);
      setSnifferResults([]);
    } 
    catch (err) {
      console.error('Error deleting session:', err);
      setError('Failed to delete session. Please try again.');
    } 
    finally {
      setLoading(false);
    }
  };

  const handleActiveSniffers = async () => {
    try {
      setLoading(true);
      const results = await listActiveSniffers();
      setSnifferResults(results);
    } 
    catch (err) {
      console.error('Error getting active sniffers:', err);
      setError('Failed to get active sniffers.');
    } 
    finally {
      setLoading(false);
    }
  };

  const handleGetSnifferStatus = async () => {
    try {
      setLoading(true);
      const status = await getLiveSnifferStatus(sessionId);
      setSnifferStatus(status);
    } catch (err) {
      console.error('Error getting sniffer status:', err);
      setError('Failed to get sniffer status.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetSnifferResults = async () => {
    try {
      setLoading(true);
      const results = await getLiveSnifferResults(sessionId);
      setSnifferResults(results);
    } catch (err) {
      console.error('Error getting sniffer results:', err);
      setError('Failed to get sniffer results.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzePcap = async () => {
    if (!pcapFile) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await analyzePcap(pcapFile, pcapName);
      setPcapAnalysisId(response.id);
      alert(`PCAP analysis started with ID: ${response.id}`);
      setPcapFile(null);
      setPcapName('');
    } catch (err) {
      console.error('Error analyzing PCAP:', err);
      setError('Failed to analyze PCAP file.');
    } finally {
      setLoading(false);
    }
  };

  const handleParseWithTshark = async () => {
    if (!tsharkFile) return;
    
    try {
      setLoading(true);
      setError(null);
      const results = await parseWithTshark(tsharkFile);
      setTsharkResults(results);
    } catch (err) {
      console.error('Error parsing with TShark:', err);
      setError('Failed to parse PCAP with TShark.');
    } finally {
      setLoading(false);
    }
  };

//   -----------------------------------------

const handleGetPcapStatus = async () => {
    try {
      setLoading(true);
      const status = await getPcapAnalysisStatus(pcapAnalysisId);
      setPcapAnalysisStatus(status);
    } catch (err) {
      console.error('Error getting PCAP status:', err);
      setError('Failed to get PCAP analysis status.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetPcapResults = async () => {
    try {
      setLoading(true);
      const results = await getPcapAnalysisResults(pcapAnalysisId, pcapLimit, pcapOffset);
      setPcapAnalysisResults(results.results || []);
    } catch (err) {
      console.error('Error getting PCAP results:', err);
      setError('Failed to get PCAP analysis results.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGetPcapSummary = async () => {
    try {
      setLoading(true);
      const summary = await getPcapAnalysisSummary(pcapAnalysisId);
      setPcapAnalysisSummary(summary);
    } catch (err) {
      console.error('Error getting PCAP summary:', err);
      setError('Failed to get PCAP analysis summary.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeletePcapAnalysis = async () => {
    try {
      setLoading(true);
      await deletePcapAnalysis(pcapAnalysisId);
      setPcapAnalysisId(null);
      setPcapAnalysisStatus(null);
      setPcapAnalysisResults([]);
      setPcapAnalysisSummary(null);
      alert('PCAP analysis deleted successfully');
    } catch (err) {
      console.error('Error deleting PCAP analysis:', err);
      setError('Failed to delete PCAP analysis.');
    } finally {
      setLoading(false);
    }
  };

//   --------------------------------------

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Historical Data</h1>
      </div>

      {!sessionId ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Click the button below to start a new monitoring session
          </p>
          <button
            onClick={handleStartSession}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Starting Session...' : 'Start New Session'}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Active Session
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
              <code className="text-blue-600 dark:text-blue-400 font-mono break-all">
                {sessionId}
              </code>
            </div>
            <div className="mt-3 flex space-x-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                onClick={handleStopSession}
              >
                Stop Session
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'pcap' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                onClick={() => setActiveTab('pcap')}
              >
                Analyze PCAP File
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'tshark' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                onClick={() => setActiveTab('tshark')}
              >
                TShark Parser
              </button>
              <button
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'sniffer' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                onClick={() => setActiveTab('sniffer')}
              >
                Sniffer Stuffs
              </button>
            </div>

            <div className="p-4">
              
            {activeTab === 'pcap' && (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">PCAP Analysis</h3>
    
    {/* File Upload Section */}
    <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <h4 className="font-medium text-gray-800 dark:text-white">Upload PCAP</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          PCAP File
        </label>
        <input
          type="file"
          onChange={(e) => setPcapFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-gray-700 dark:file:text-white
            dark:hover:file:bg-gray-600"
          accept=".pcap,.pcapng"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Analysis Name (optional)
        </label>
        <input
          type="text"
          value={pcapName}
          onChange={(e) => setPcapName(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
          placeholder="My PCAP Analysis"
        />
      </div>
      <button
        onClick={handleAnalyzePcap}
        disabled={!pcapFile || loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {loading ? 'Analyzing...' : 'Analyze PCAP'}
      </button>
    </div>

    {/* Analysis Controls Section */}
    {pcapAnalysisId && (
      <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-white">Analysis Controls</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Analysis ID
            </label>
            <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded text-sm font-mono break-all">
              {pcapAnalysisId}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleGetPcapStatus}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
              >
                Get Status
              </button>
              <button
                onClick={handleGetPcapSummary}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
              >
                Get Summary
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleDeletePcapAnalysis}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
              >
                Delete Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Results Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Limit
            </label>
            <select
              value={pcapLimit}
              onChange={(e) => setPcapLimit(Number(e.target.value))}
              className="w-full bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white rounded px-2 py-1 text-xs"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Offset
            </label>
            <input
              type="number"
              value={pcapOffset}
              onChange={(e) => setPcapOffset(Number(e.target.value))}
              min="0"
              className="w-full bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white rounded px-2 py-1 text-xs"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGetPcapResults}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs disabled:opacity-50"
            >
              Get Results
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Status Display */}
    {pcapAnalysisStatus && (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Analysis Status:</h4>
        <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
          {JSON.stringify(pcapAnalysisStatus, null, 2)}
        </pre>
      </div>
    )}

    {/* Summary Display */}
    {pcapAnalysisSummary && (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Analysis Summary:</h4>
        <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
          {JSON.stringify(pcapAnalysisSummary, null, 2)}
        </pre>
      </div>
    )}

    {/* Results Display */}
    {pcapAnalysisResults.length > 0 && (
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-gray-800 dark:text-white">
            Analysis Results ({pcapAnalysisResults.length})
          </h4>
        </div>
        <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
          {JSON.stringify(pcapAnalysisResults, null, 2)}
        </pre>
      </div>
    )}
  </div>
)}
              {activeTab === 'tshark' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">TShark Parser</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        PCAP File
                      </label>
                      <input
                        type="file"
                        onChange={(e) => setTsharkFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          dark:file:bg-gray-700 dark:file:text-white
                          dark:hover:file:bg-gray-600"
                        accept=".pcap,.pcapng"
                      />
                    </div>
                    <button
                      onClick={handleParseWithTshark}
                      disabled={!tsharkFile || loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                    >
                      {loading ? 'Parsing...' : 'Parse with TShark'}
                    </button>
                  </div>
                  {tsharkResults && (
                    <div className="mt-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-2">Results:</h4>
                      <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                        {JSON.stringify(tsharkResults, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sniffer' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sniffer Controls</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={handleGetSnifferStatus}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Get Sniffer Status
                      </button>
                      <button
                        onClick={handleGetSnifferResults}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Get Sniffer Results
                      </button>
                      <button
                        onClick={handleActiveSniffers}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Get Active Sniffers
                      </button>
                      <button
                        onClick={handleDeleteSession}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
                      >
                        Delete Session
                      </button>
                    </div>
                    
                    {snifferStatus && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Status:</h4>
                        <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                          {JSON.stringify(snifferStatus, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {snifferResults.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Results ({snifferResults.length}):</h4>
                        <pre className="text-xs text-gray-800 dark:text-gray-300 overflow-x-auto">
                          {JSON.stringify(snifferResults, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
