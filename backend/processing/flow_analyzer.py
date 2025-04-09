from collections import defaultdict

class FlowAnalyzer:
    def __init__(self):
        self.flows = defaultdict(list)

    def process_packet(self, packet):
        if 'IP' in packet:
            proto = 'TCP' if 'TCP' in packet else 'UDP' if 'UDP' in packet else 'OTHER'
            src = packet['IP'].src
            dst = packet['IP'].dst
            sport = packet[proto].sport if proto != 'OTHER' else 0
            dport = packet[proto].dport if proto != 'OTHER' else 0

            flow_key = (src, dst, sport, dport, proto)
            self.flows[flow_key].append(packet.time)

    def get_active_flows(self):
        return self.flows

