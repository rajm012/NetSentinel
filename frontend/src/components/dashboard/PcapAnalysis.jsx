import { useState, useEffect } from 'react';
import {
  fetchPcapAnalyses,
  getPcapAnalysis,
  getPcapSummary,
  uploadPcap,
  deletePcapAnalysis
} from '../../utils/hispi';

export default function PcapAnalysis() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => {
    const loadAnalyses = async () => {
      try {
        setLoading(true);
        const data = await fetchPcapAnalyses();
        setAnalyses(data.analyses || []);
      } catch (error) {
        console.error('Error loading analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyses();
  }, []);

  useEffect(() => {
    if (selectedAnalysis) {
      const loadAnalysisDetails = async () => {
        try {
          setLoading(true);
          const [resultsData, summaryData] = await Promise.all([
            getPcapAnalysis(selectedAnalysis.id),
            getPcapSummary(selectedAnalysis.id)
          ]);
          setResults(resultsData.results);
          setSummary(summaryData);
        } catch (error) {
          console.error('Error loading analysis details:', error);
        } finally {
          setLoading(false);
        }
      };

      loadAnalysisDetails();
    }
  }, [selectedAnalysis]);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      await uploadPcap(file, name || file.name);
      const data = await fetchPcapAnalyses();
      setAnalyses(data.analyses || []);
      setFile(null);
      setName('');
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePcapAnalysis(id);
      const data = await fetchPcapAnalyses();
      setAnalyses(data.analyses || []);
      if (selectedAnalysis && selectedAnalysis.id === id) {
        setSelectedAnalysis(null);
        setResults([]);
        setSummary(null);
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">PCAP Analysis</h2>

      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-2">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
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
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Custom name (optional)"
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded px-3 py-2 text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 h-full">
            <h3 className="font-medium text-gray-800 dark:text-white mb-3">Saved Analyses</h3>
            {loading && analyses.length === 0 ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            ) : analyses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
                No analyses available
              </p>
            ) : (
              <ul className="space-y-2">
                {analyses.map((analysis) => (
                  <li
                    key={analysis.id}
                    className={`p-2 rounded cursor-pointer text-sm ${
                      selectedAnalysis?.id === analysis.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                    onClick={() => setSelectedAnalysis(analysis)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="truncate">{analysis.name || analysis.original_filename}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(analysis.id);
                        }}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs p-1"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          {selectedAnalysis ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">
                  {selectedAnalysis.name || selectedAnalysis.original_filename}
                </h3>
                {summary ? (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Packet Count</p>
                      <p className="font-medium">{summary.packet_count}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="font-medium">
                        {summary.duration ? `${summary.duration.toFixed(2)}s` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Protocols</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {summary.protocols?.map((proto) => (
                          <span
                            key={proto}
                            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs"
                          >
                            {proto}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Top Talkers</p>
                      <div className="space-y-1 mt-1">
                        {summary.top_talkers?.map((talker) => (
                          <div key={talker.ip} className="flex justify-between text-xs">
                            <span>{talker.ip}</span>
                            <span>{talker.count} packets</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 dark:text-white mb-2">Packet Details</h3>
                {loading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : results.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm py-2">
                    No packet details available
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead>
                        <tr>
                          <th className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">No.</th>
                          <th className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">Time</th>
                          <th className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">Source</th>
                          <th className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">Destination</th>
                          <th className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">Protocol</th>
                          <th className="px-2 py-1 text-left text-gray-500 dark:text-gray-400">Length</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {results.map((pkt, i) => (
                          <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                            <td className="px-2 py-1">{i + 1}</td>
                            <td className="px-2 py-1">{pkt.timestamp}</td>
                            <td className="px-2 py-1">{pkt.src}</td>
                            <td className="px-2 py-1">{pkt.dst}</td>
                            <td className="px-2 py-1">{pkt.protocol}</td>
                            <td className="px-2 py-1">{pkt.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Select an analysis from the left to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
