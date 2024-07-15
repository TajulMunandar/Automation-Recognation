import os
import librosa
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import pandas as pd


# Function to load audio from file
def load_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr


# Function to extract features from audio
def extract_features(audio, sr, n_fft=512):
    n_fft = min(len(audio), n_fft)
    stft = librosa.stft(audio, n_fft=n_fft)
    feature = np.abs(stft).mean(axis=1)
    return feature


# Function to predict label from audio file
def predict(audio_path, model, le):
    audio, sr = load_audio(audio_path)
    feature = extract_features(audio, sr)
    feature = feature.reshape(1, -1)
    prediction = model.predict(feature)
    predicted_label = le.inverse_transform([np.argmax(prediction)])[0]
    return predicted_label


# Load the trained model and label encoder
model = load_model("best_model.h5")
le = LabelEncoder()

# Load the original labels used during training
# Assuming you have a CSV file with the training data
train_data_path = "./content/suara.csv"
train_data = pd.read_csv(train_data_path)
labels = train_data["transcript"]

# Fit LabelEncoder with the original labels
le.fit(labels)

# Example usage of the prediction function
audio_path = (
    "./content/dataset/bagah/bagah_c_jal.wav"  # Replace with path to new audio file
)
predicted_label = predict(audio_path, model, le)
print(f"Predicted label: {predicted_label}")
