import { useState, useRef } from 'react';
import { uploadPcap } from '../../utils/testbedAPI';
import TestbedControls from './TestbedControls';

const PacketUploader = ({ onUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [testJobId, setTestJobId] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (file) => {
    if (file.name.endsWith('.pcap') || file.name.endsWith('.pcapng')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid .pcap or .pcapng file');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("No file selected. Please select a file to upload.");
      return;
    }

    try {
      const result = await uploadPcap(selectedFile);
      setTestJobId(result.jobId); 
    } 
    catch (error) {
      console.error('Upload error:', error);
      setTestJobId(null);
    }
  };

  return (
    <div className="bg-gray-800 shadow rounded-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-blue-400 mb-4">Upload PCAP File</h2>
      <p className="text-gray-300 mb-6">
        Upload a packet capture file (.pcap/.pcapng) to test against your detection rules. 
        The system will process the file and show you which alerts would be triggered.
      </p>

      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-blue-500 bg-blue-900/20' : 'border-gray-600 bg-gray-900'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pcap,.pcapng"
          onChange={handleInputChange}
        />

        {selectedFile ? (
          <div className="mb-4">
            <p className="font-bold text-gray-300">Selected file:</p>
            <p className="text-blue-400">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mt-1 text-gray-400">Drag and drop a .pcap file here, or click to select</p>
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleClick}
            className="px-4 py-2 bg-gray-700 rounded-md text-gray-200 hover:bg-gray-600 mr-4"
          >
            {selectedFile ? 'Select Different File' : 'Select File'}
          </button>

          {selectedFile && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Uploading...' : 'Upload & Analyze'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-300 mb-2">Tips:</h3>
        <ul className="list-disc pl-5 text-gray-400 text-sm">
          <li>Maximum file size: 100MB</li>
          <li>Supported formats: .pcap, .pcapng</li>
          <li>For better results, use files with at least 1 minute of traffic</li>
          <li>The system will analyze all packets in the capture</li>
        </ul>
      </div>
    </div>
    
  );

};

export default PacketUploader;
