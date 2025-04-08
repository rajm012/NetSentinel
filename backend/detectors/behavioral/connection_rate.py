import time

def monitor_conn_rate(packet, window=10, limit=100):
    now = time.time()
    if not hasattr(monitor_conn_rate, "conn_times"):
        monitor_conn_rate.conn_times = []

    monitor_conn_rate.conn_times.append(now)
    monitor_conn_rate.conn_times = [t for t in monitor_conn_rate.conn_times if now - t < window]

    if len(monitor_conn_rate.conn_times) > limit:
        return True
    return False
