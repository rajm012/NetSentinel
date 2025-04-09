from sklearn.preprocessing import MinMaxScaler

class FeatureNormalizer:
    def __init__(self):
        self.scaler = MinMaxScaler()

    def fit_transform(self, data):
        return self.scaler.fit_transform(data)

    def transform(self, data):
        return self.scaler.transform(data)

