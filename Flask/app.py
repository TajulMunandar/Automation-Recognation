# app.py

from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import os
import librosa
import numpy as np
import subprocess

app = Flask(__name__)


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


# Endpoint untuk memulai proses pelatihan
@app.route("/train", methods=["GET"])
def train_model():
    try:
        # Jalankan script train.py sebagai subprocess
        subprocess.run(["python", "train.py"])
        return jsonify({"message": "Training selesai."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Endpoint untuk memprediksi label dari file audio yang diunggah
@app.route("/predict", methods=["get"])
def predict_audio():
    # if "file" not in request.files:
    #     return jsonify({"error": "No file part"}), 400

    # file = request.files["file"]
    audio_path = "./content/dataset/suum/suum_andra.wav"
    # file.save(audio_path)

    try:
        predicted_label = predict(audio_path, model, le)
        return jsonify({"predicted_label": predicted_label}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
