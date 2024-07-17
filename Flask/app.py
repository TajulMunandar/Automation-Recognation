from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import os
import numpy as np
import subprocess
import librosa

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "./temp/audio"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# Function untuk muat audio dari file menggunakan wave
def load_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr


# Function untuk ekstrak fitur dari audio
def extract_features(audio, sr, n_fft=512):
    n_fft = min(len(audio), n_fft)
    stft = librosa.stft(audio, n_fft=n_fft)
    feature = np.abs(stft).mean(axis=1)
    return feature


# Function untuk prediksi label dari file audio
def predict(audio_path, model, le):
    audio, sr = load_audio(audio_path)
    feature = extract_features(audio, sr)
    feature = feature.reshape(1, -1)
    prediction = model.predict(feature)
    predicted_label = le.inverse_transform([np.argmax(prediction)])[0]
    return predicted_label


model = load_model("best_model.h5")
le = LabelEncoder()

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


# Endpoint untuk prediksi label dari file audio yang diunggah
@app.route("/predict", methods=["POST"])
def predict_audio():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]
        print("Received file:", file.filename)

        temp_file_path = os.path.join(app.config["UPLOAD_FOLDER"], "recorded.wav")
        file.save(temp_file_path)
        print("File saved:", temp_file_path)

        predicted_label = predict(temp_file_path, model, le)
        print("Predicted label:", predicted_label)

        return jsonify({"predicted_label": predicted_label}), 200
    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
