# backend/processing/normalizer.py
from sklearn.preprocessing import StandardScaler
import numpy as np

class FeatureNormalizer:
    def __init__(self):
        self.scaler = StandardScaler()

    def fit_transform(self, data):
        return self.scaler.fit_transform(np.array(data))

    def transform(self, data):
        if not hasattr(self.scaler, "mean_"):
            raise ValueError("Scaler not fitted. Call fit_transform first.")
        return self.scaler.transform(np.array(data))


normalizer_instance = FeatureNormalizer()
