from utils.entropy import calculate_entropy
from utils.helpers import format_timestamp, log_alert

print("[*] Entropy of test string:", calculate_entropy("suspiciousdomain1234"))
print("[*] Formatted time:", format_timestamp())
log_alert({"type": "Test Alert", "timestamp": format_timestamp()})
