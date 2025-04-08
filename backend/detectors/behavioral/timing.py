def detect_timing_anomaly(packet, min_interval=0.001):
    import time
    now = time.time()

    if not hasattr(detect_timing_anomaly, "last_time"):
        detect_timing_anomaly.last_time = now

    interval = now - detect_timing_anomaly.last_time
    detect_timing_anomaly.last_time = now

    if interval < min_interval:
        return True

    return False
