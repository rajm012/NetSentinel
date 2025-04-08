def monitor_bandwidth(packet, threshold=1e6):
    if not hasattr(monitor_bandwidth, "byte_count"):
        monitor_bandwidth.byte_count = 0

    monitor_bandwidth.byte_count += len(packet)

    if monitor_bandwidth.byte_count > threshold:
        return True

    return False
