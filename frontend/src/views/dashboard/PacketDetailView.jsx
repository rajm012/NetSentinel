import React from 'react';
import PacketDetailPage from '../../components/dashboard/PacketDetailPage';

const PacketDetailView = () => {
  // Mock packet data - this would come from API in real implementation
  const mockPacket = {
    id: 'pkt_123456',
    timestamp: '2023-11-15T14:22:36.123Z',
    sourceIp: '192.168.1.105',
    destinationIp: '104.16.85.20',
    sourcePort: 54321,
    destinationPort: 443,
    protocol: 'TCP',
    length: 1428,
    flags: ['ACK', 'PSH'],
    threatLevel: 'medium',
    threatType: 'Suspicious TLS Fingerprint',
    anomalies: [
      'Uncommon TLS cipher suite',
      'Certificate validity period too long'
    ],
    geoData: {
      source: {
        country: 'United States',
        city: 'New York',
        isp: 'DigitalOcean LLC',
        coordinates: [40.7128, -74.0060]
      },
      destination: {
        country: 'United States',
        city: 'San Francisco',
        isp: 'Cloudflare',
        coordinates: [37.7749, -122.4194]
      }
    },
    layers: {
      ethernet: {
        sourceMac: '00:1A:2B:3C:4D:5E',
        destinationMac: '00:5E:4D:3C:2B:1A',
        type: 'IPv4'
      },
      ip: {
        version: 4,
        headerLength: 20,
        ttl: 64,
        protocol: 'TCP',
        checksum: '0x4a3d'
      },
      tcp: {
        sequenceNumber: 1234567890,
        ackNumber: 987654321,
        windowSize: 64240,
        checksum: '0x8f2a'
      },
      tls: {
        version: 'TLS 1.2',
        cipherSuite: 'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        sni: 'example.com',
        certificate: {
          issuer: 'CN=Example CA, OU=Security, O=Example Inc',
          validFrom: '2022-01-01',
          validTo: '2025-01-01'
        }
      }
    },
    rawHex: '4500003c 4a3d4000 40064a3d c0a80169 6810a814 d43101bb 00000000 00000000 5002ffff 8f2a0000 17030100 2c000000 00000000 00000000 00000000'
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PacketDetailPage packet={mockPacket} />
      </div>
    </div>
  );
};

export default PacketDetailView;
