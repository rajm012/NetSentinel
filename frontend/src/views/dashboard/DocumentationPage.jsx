import React from 'react';
import { BookOpenIcon, LightningBoltIcon, ClockIcon, ShieldCheckIcon, CogIcon, BeakerIcon, UploadIcon, UserIcon } from '@heroicons/react/outline';

const DocumentationPage = () => {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <BookOpenIcon className="h-8 w-8 text-blue-400 mr-3" />
          <h1 className="text-3xl font-bold text-blue-400">🛡️ NetSentinel Documentation</h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 bg-gray-900 rounded-lg p-4 border border-gray-800 h-fit">
            <h2 className="text-lg font-semibold mb-4 text-gray-300 border-b border-gray-800 pb-2">Sections</h2>
            <nav className="space-y-2">
              <a href="#getting-started" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Getting Started</a>
              <a href="#real-time" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Real-Time Monitoring</a>
              <a href="#historical" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Historical Data</a>
              <a href="#threat-intel" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Threat Intelligence</a>
              <a href="#configuration" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Configuration</a>
              <a href="#testbed" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Packet Testbed</a>
              <a href="#upload-logs" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">Log Upload</a>
              <a href="#api" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">API Reference</a>
              <a href="#faq" className="block py-2 px-3 rounded hover:bg-gray-800 text-gray-300 hover:text-white">FAQ</a>
            </nav>
          </div>

          {/* Documentation Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Getting Started */}
            <section id="getting-started" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-2" />
                Getting Started
              </h2>
              <div className="prose prose-invert max-w-none">
                <h3 className="text-xl font-semibold mb-3 text-gray-300">Introduction</h3>
                <p className="text-gray-300 mb-4">
                🛡️ NetSentinel is a comprehensive network monitoring and threat detection system designed for security professionals. 
                  It provides real-time traffic analysis, historical data review, and advanced threat detection capabilities.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">System Requirements</h3>
                <ul className="list-disc pl-5 text-gray-300 mb-4 space-y-2">
                  <li>Modern web browser (Chrome, Firefox, Edge, or Safari)</li>
                  <li>Minimum 4GB RAM (8GB recommended for large captures)</li>
                  <li>Network interface with promiscuous mode support</li>
                  <li>Node.js v14+ for local deployment</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Installation</h3>
                <div className="bg-gray-800 p-4 rounded mb-4 border border-gray-700">
                  <pre className="text-green-400 font-mono text-sm">
                    <code>
                      # Clone the repository\n
                      git clone https://github.com/your-repo/packetsniffer.git\n
                      \n
                      # Install dependencies\n
                      cd packetsniffer\n
                      npm install\n
                      \n
                      # Start the application\n
                      npm start
                    </code>
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">First Run</h3>
                <ol className="list-decimal pl-5 text-gray-300 space-y-2">
                  <li>Launch the application</li>
                  <li>Navigate to the Configuration page</li>
                  <li>Select your network interface</li>
                  <li>Start capturing traffic</li>
                  <li>Review alerts in the Real-Time view</li>
                </ol>
              </div>
            </section>

            {/* Real-Time Monitoring */}
            <section id="real-time" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <LightningBoltIcon className="h-6 w-6 mr-2" />
                Real-Time Monitoring
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  The Real-Time view provides live monitoring of network traffic with immediate threat detection and alerting.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Live Packet Capture</h4>
                    <p className="text-gray-300 text-sm">View packets as they traverse your network with protocol breakdown and flow analysis.</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Alert Dashboard</h4>
                    <p className="text-gray-300 text-sm">Real-time alerts for suspicious activities with severity classification.</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">GeoIP Mapping</h4>
                    <p className="text-gray-300 text-sm">Visualize traffic origins on a world map with threat heatmap overlay.</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Protocol Analysis</h4>
                    <p className="text-gray-300 text-sm">Breakdown of protocol usage with detailed packet inspection.</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Controls</h3>
                <table className="min-w-full divide-y divide-gray-700 mb-4">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Control</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">Start/Stop Capture</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Toggle live packet capture</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">Interface Selector</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Choose which network interface to monitor</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">BPF Filter</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Apply Berkeley Packet Filters to focus on specific traffic</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">Alert Thresholds</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Adjust sensitivity for different threat types</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Historical Data */}
            <section id="historical" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <ClockIcon className="h-6 w-6 mr-2" />
                Historical Data Analysis
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Review past network activity, analyze trends, and investigate security incidents with comprehensive historical data tools.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Key Features</h3>
                <ul className="list-disc pl-5 text-gray-300 mb-4 space-y-2">
                  <li>Time-range filtering with customizable intervals</li>
                  <li>Advanced query builder for complex searches</li>
                  <li>Session reconstruction and flow analysis</li>
                  <li>Export capabilities in multiple formats (PCAP, CSV, JSON)</li>
                  <li>Correlation with threat intelligence feeds</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Query Examples</h3>
                <div className="bg-gray-800 p-4 rounded mb-4 border border-gray-700">
                  <pre className="text-green-400 font-mono text-sm">
                    <code>
                      // Find all HTTP requests to specific host\n
                      protocol:http AND destination:example.com\n
                      \n
                      // Find failed login attempts\n
                      event_type:auth_failure\n
                      \n
                      // Find traffic from suspicious IP ranges\n
                      src_ip:192.168.1.100-192.168.1.200 AND threat_score:{'>'}70
                    </code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Threat Intelligence */}
            <section id="threat-intel" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <ShieldCheckIcon className="h-6 w-6 mr-2" />
                Threat Intelligence
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  The Threat Intelligence module correlates network activity with known threats, behavioral anomalies, and attack patterns.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Detection Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Signature-Based</h4>
                    <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
                      <li>Known malware C2 patterns</li>
                      <li>Exploit kit fingerprints</li>
                      <li>IDS/IPS rule matching</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Anomaly-Based</h4>
                    <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
                      <li>Behavioral deviations</li>
                      <li>Protocol violations</li>
                      <li>Traffic spikes</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Threat Feeds</h4>
                    <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
                      <li>IP reputation services</li>
                      <li>Malware hash databases</li>
                      <li>Vulnerability databases</li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Heuristics</h4>
                    <ul className="list-disc pl-5 text-gray-300 text-sm space-y-1">
                      <li>Credential stuffing patterns</li>
                      <li>Data exfiltration detection</li>
                      <li>Lateral movement tracking</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Configuration */}
            <section id="configuration" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <CogIcon className="h-6 w-6 mr-2" />
                System Configuration
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Customize PacketSniffer's behavior to match your network environment and security requirements.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Configuration Sections</h3>
                <table className="min-w-full divide-y divide-gray-700 mb-4">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Section</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    <tr>
                      <td className="px-4 py-3 text-sm text-blue-400">Capture Settings</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Interface selection, buffer sizes, capture filters</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-blue-400">Detection Rules</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Enable/disable specific detectors, adjust sensitivity</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-blue-400">Alerting</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Notification channels, severity thresholds</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-blue-400">Storage</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Retention policies, database configuration</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-blue-400">Integrations</td>
                      <td className="px-4 py-3 text-sm text-gray-400">SIEM connections, threat feed APIs</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Example Configuration</h3>
                <div className="bg-gray-800 p-4 rounded mb-4 border border-gray-700">
                  <pre className="text-yellow-300 font-mono text-sm">
                    <code>
                      {`{
  "capture": {
    "interface": "eth0",
    "buffer_size": "64MB",
    "filter": "not port 22"
  },
  "detection": {
    "enabled_modules": ["scan_detection", "malware_c2"],
    "sensitivity": {
      "scan_detection": "medium",
      "bruteforce": "high"
    }
  },
  "alerting": {
    "email": {
      "enabled": true,
      "recipients": ["security@example.com"]
    }
  }
}`}
                    </code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Packet Testbed */}
            <section id="testbed" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <BeakerIcon className="h-6 w-6 mr-2" />
                Packet Testbed
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Safely test detection rules and analyze suspicious traffic patterns in an isolated environment.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">PCAP Replay</h4>
                    <p className="text-gray-300 text-sm">Upload existing packet captures for analysis</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Traffic Generation</h4>
                    <p className="text-gray-300 text-sm">Create synthetic traffic with customizable patterns</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Attack Simulation</h4>
                    <p className="text-gray-300 text-sm">Test against common attack vectors</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded border border-gray-700">
                    <h4 className="font-medium text-blue-400 mb-2">Rule Validation</h4>
                    <p className="text-gray-300 text-sm">Verify detection logic before production deployment</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Use Cases</h3>
                <ul className="list-disc pl-5 text-gray-300 mb-4 space-y-2">
                  <li>Testing new detection rules before deployment</li>
                  <li>Training security personnel on attack patterns</li>
                  <li>Validating system performance under load</li>
                  <li>Reproducing and analyzing suspicious traffic</li>
                </ul>
              </div>
            </section>

            {/* Log Upload */}
            <section id="upload-logs" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center">
                <UploadIcon className="h-6 w-6 mr-2" />
                Log Upload and Analysis
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Import external log files for correlation with network traffic and enhanced threat detection.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Supported Formats</h3>
                <table className="min-w-full divide-y divide-gray-700 mb-4">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Format</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">PCAP/PCAPNG</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Packet capture files from Wireshark, tcpdump, etc.</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">JSON</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Structured log data with timestamped events</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">CSV</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Comma-separated values with header row</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">Syslog</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Standard syslog format (RFC 3164)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-300">EVTX</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Windows Event Log files</td>
                    </tr>
                  </tbody>
                </table>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Processing Options</h3>
                <ul className="list-disc pl-5 text-gray-300 mb-4 space-y-2">
                  <li>Time normalization across multiple sources</li>
                  <li>Field mapping for custom log formats</li>
                  <li>Automatic correlation with existing data</li>
                  <li>Batch processing for large files</li>
                </ul>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">API Reference</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-4">
                  Programmatically interact with NetSentinel through its REST API for automation and integration.
                </p>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Authentication</h3>
                <div className="bg-gray-800 p-4 rounded mb-4 border border-gray-700">
                  <pre className="text-green-400 font-mono text-sm">
                    <code>
                      # Include API key in headers\n
                      curl -H "Authorization: Bearer YOUR_API_KEY" https://your-instance/api/v1/...
                    </code>
                  </pre>
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-300">Endpoints</h3>
                <table className="min-w-full divide-y divide-gray-700 mb-4">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Endpoint</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900 divide-y divide-gray-800">
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-blue-400">/api/v1/capture</td>
                      <td className="px-4 py-3 text-sm text-gray-300">POST</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Start/stop packet capture</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-blue-400">/api/v1/alerts</td>
                      <td className="px-4 py-3 text-sm text-gray-300">GET</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Retrieve alerts with filters</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-blue-400">/api/v1/pcaps</td>
                      <td className="px-4 py-3 text-sm text-gray-300">POST</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Upload PCAP files</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-mono text-blue-400">/api/v1/config</td>
                      <td className="px-4 py-3 text-sm text-gray-300">PUT</td>
                      <td className="px-4 py-3 text-sm text-gray-400">Update system configuration</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Frequently Asked Questions</h2>
              <div className="prose prose-invert max-w-none space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300">How do I reset my password?</h3>
                  <p className="text-gray-400">
                    Navigate to the Profile page and click "Change Password". You'll need to provide your current password and set a new one.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300">What's the maximum file size for PCAP uploads?</h3>
                  <p className="text-gray-400">
                    The default maximum is 100MB, but this can be increased in the Configuration page under "Upload Settings".
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300">How often are threat intelligence feeds updated?</h3>
                  <p className="text-gray-400">
                    Built-in feeds update every 24 hours. Premium feeds can be configured to update as frequently as every hour.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Can I integrate with my SIEM?</h3>
                  <p className="text-gray-400">
                    Yes, NetSentinel supports integration with most major SIEMs through syslog forwarding, webhooks, or direct API calls.
                    Configuration options are available in the Integrations section.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-300">Where are captured packets stored?</h3>
                  <p className="text-gray-400">
                    By default, packets are stored in an encrypted local database. You can configure external storage in the Configuration page.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
