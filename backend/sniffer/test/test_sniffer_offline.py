# test_sniffer_offline.py

from sniffer.offline_analyzer import OfflineAnalyzer

if __name__ == "__main__":
    filepath = "sample.pcap"
    analyzer = OfflineAnalyzer(filepath)
    analyzer.analyze()
    
#-------------------------------------------------------------------- 
# (zenv) PS E:\4th Semester\Packet Sniffer\backend> python test_sniffer_offline.py
# [📁] Analyzing file: sample.pcap
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 21939, Dst Port: 443
# [DNS] Query: mobile.events.data.microsoft.com.
# [DNS] Query: mobile.events.data.microsoft.com.
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 22024, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22024
# [TCP] Src Port: 22024, Dst Port: 443
# [TCP] Src Port: 22024, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22024
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 21939
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 21939, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 22023, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 443, Dst Port: 22023
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 22022, Dst Port: 443
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22022
# [TCP] Src Port: 443, Dst Port: 22024

# -----------------------------------------------------------
