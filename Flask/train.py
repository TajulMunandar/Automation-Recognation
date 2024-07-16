import os
import librosa
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint


# Fungsi untuk memuat audio dari file
def load_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr


# Fungsi untuk mengekstrak fitur MFCC dan lainnya dari audio
def extract_features(audio, sr):
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    chroma = librosa.feature.chroma_stft(y=audio, sr=sr)
    mel = librosa.feature.melspectrogram(y=audio, sr=sr)
    contrast = librosa.feature.spectral_contrast(y=audio, sr=sr)
    tonnetz = librosa.feature.tonnetz(y=librosa.effects.harmonic(audio), sr=sr)

    features = np.hstack(
        [
            np.mean(mfccs.T, axis=0),
            np.mean(chroma.T, axis=0),
            np.mean(mel.T, axis=0),
            np.mean(contrast.T, axis=0),
            np.mean(tonnetz.T, axis=0),
        ]
    )
    return features


import librosa
import numpy as np


def load_audio(file_path):
    audio, sr = librosa.load(file_path, sr=None)
    return audio, sr


def extract_features(audio, sr, n_fft=512):
    # Sesuaikan n_fft dengan panjang sinyal audio
    n_fft = min(len(audio), n_fft)
    stft = librosa.stft(audio, n_fft=n_fft)
    feature = np.abs(stft).mean(axis=1)
    return feature


# Path ke file CSV (ganti dengan path sesuai kebutuhan Anda)
file_path = "./content/suara.csv"


# Baca file CSV
data = pd.read_csv(file_path)
print("CSV berhasil dibaca.")

# List untuk menyimpan fitur dan label
features = []
labels = []

# Iterasi melalui setiap baris dalam CSV
for index, row in data.iterrows():
    file_path = row["audio_path"]
    label = row["transcript"]
    audio, sr = load_audio(file_path)
    feature = extract_features(audio, sr)
    features.append(feature)
    labels.append(label)

print("Ekstraksi fitur selesai.")

# Konversi list menjadi numpy array
X = np.array(features)
y = np.array(labels)

# Encoding label menggunakan LabelEncoder
from sklearn.preprocessing import LabelEncoder

le = LabelEncoder()
y = le.fit_transform(y)
print("Label encoding selesai.")

# Bagi dataset menjadi data latih dan data uji
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print("Data berhasil dibagi.")


# Definisikan model neural network
model = Sequential(
    [
        Dense(512, activation="relu", input_shape=(X_train.shape[1],)),
        Dropout(0.3),
        Dense(256, activation="relu"),
        Dropout(0.3),
        Dense(128, activation="relu"),
        Dropout(0.3),
        Dense(len(np.unique(y)), activation="softmax"),
    ]
)

# Kompilasi model
model.compile(
    optimizer="adam", loss="sparse_categorical_crossentropy", metrics=["accuracy"]
)

# Tambahkan early stopping dan model checkpointing
early_stopping = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)
model_checkpoint = ModelCheckpoint("best_model.h5", save_best_only=True)

# Latih model
history = model.fit(
    X_train,
    y_train,
    epochs=200,
    validation_data=(X_test, y_test),
    callbacks=[early_stopping, model_checkpoint],
)

# Simpan model setelah pelatihan selesai
model.save("best_model.h5")

# Evaluasi model
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Akurasi: {accuracy}")

print("Model Berhasil dilatih dan disimpan")
