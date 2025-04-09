# utils/entropy.py
import math

def calculate_entropy(data):
    if not data:
        return 0
    entropy = 0
    for x in set(data):
        p = data.count(x) / len(data)
        entropy -= p * math.log2(p)
    return entropy
