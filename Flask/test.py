import os
import librosa
import numpy as np
import soundfile as sf
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from scipy.signal import butter, lfilter

# Function to load audio from file
def load_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr

# Function to apply low-pass filter
def low_pass_filter(audio, cutoff=3000, fs=22050, order=5):
    nyquist = 0.5 * fs
    normal_cutoff = cutoff / nyquist
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    return lfilter(b, a, audio)

# Function to reduce noise from audio
def reduce_noise(audio, noise_reduction_factor=0.3):
    # Simple noise reduction by subtracting a fraction of the audio's mean
    audio_denoised = audio - noise_reduction_factor * np.mean(audio)
    return audio_denoised

# Function to normalize audio
def normalize_audio(audio):
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val
    return audio

# Function to extract features from audio
def extract_features(audio, sr, n_fft=512):
    n_fft = min(len(audio), n_fft)
    stft = librosa.stft(audio, n_fft=n_fft)
    feature = np.abs(stft).mean(axis=1)
    return feature

# Function to predict label from audio file
def predict(audio_path, model, le):
    audio, sr = load_audio(audio_path)

    # Reduce noise from audio
    audio = reduce_noise(audio)

    # Apply low-pass filter to remove high-frequency noise
    audio = low_pass_filter(audio)

    # Normalize audio
    audio = normalize_audio(audio)


    feature = extract_features(audio, sr)
    feature = feature.reshape(1, -1)
    prediction = model.predict(feature)
    predicted_label = le.inverse_transform([np.argmax(prediction)])[0]
    return predicted_label

# Load the trained model and label encoder
model = load_model("best_model.h5")
le = LabelEncoder()

# Load the original labels used during training
train_data_path = "./content/suara.csv"
train_data = pd.read_csv(train_data_path)
labels = train_data["transcript"]

# Fit LabelEncoder with the original labels
le.fit(labels)

# Example usage of the prediction function
audio_path = "./content/dataset/tulong/tulong_c_jal.wav"  # Replace with path to new audio file
predicted_label = predict(audio_path, model, le)
print(f"Predicted label: {predicted_label}")
