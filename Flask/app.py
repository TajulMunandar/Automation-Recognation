from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import os
import numpy as np
import subprocess
import librosa
import pika
import threading

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "./temp/audio"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# RabbitMQ Configuration
RABBITMQ_HOST = "localhost"
RABBITMQ_QUEUE = "audio"


# Function to send message to RabbitMQ
def send_to_rabbitmq(queue, message):
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_HOST)
        )
        channel = connection.channel()
        channel.queue_declare(queue=queue, durable=True)
        channel.basic_publish(
            exchange="",
            routing_key=queue,
            body=message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # make message persistent
            ),
        )
        connection.close()
        return True
    except Exception as e:
        print(f"Error sending to RabbitMQ: {str(e)}")
        return False


# Function to consume message from RabbitMQ
def consume_from_rabbitmq(queue):
    try:
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=RABBITMQ_HOST)
        )
        channel = connection.channel()
        channel.queue_declare(queue=queue, durable=True)

        def callback(ch, method, properties, body):
            print(
                " [x] Received %r" % body.decode()
            )  # Decode body to string if necessary

        channel.basic_consume(queue=queue, on_message_callback=callback, auto_ack=True)
        print(" [*] Waiting for messages. To exit press CTRL+C")
        channel.start_consuming()
        return True
    except Exception as e:
        print(f"Error consuming from RabbitMQ: {str(e)}")
        return False


# Function to load audio file using librosa
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
    confidence = np.max(prediction)  # Get maximum confidence score
    return predicted_label, confidence


model = load_model("best_model.h5")
le = LabelEncoder()

train_data_path = "./content/suara.csv"
train_data = pd.read_csv(train_data_path)
labels = train_data["transcript"]

# Fit LabelEncoder with the original labels
le.fit(labels)

ANOMALY_THRESHOLD = 0.5


# Endpoint to start training process
@app.route("/train", methods=["GET"])
def train_model():
    try:
        # Run train.py script as subprocess
        subprocess.run(["python", "train.py"])
        return jsonify({"message": "Training completed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Endpoint to predict label from uploaded audio file
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

        predicted_label, confidence = predict(temp_file_path, model, le)

        if confidence < ANOMALY_THRESHOLD:
            anomaly_detected = True
        else:
            anomaly_detected = False

        success = send_to_rabbitmq(RABBITMQ_QUEUE, predicted_label)

        if success:
            print("Predicted label:", predicted_label)
            if anomaly_detected:
                print("Anomaly detected!")
                # Handle anomaly, for example, log it or take specific action
                # Here, let's return a response indicating anomaly detected
                return (
                    jsonify(
                        {
                            "predicted_label": predicted_label,
                            "confidence": float(confidence),
                            "anomaly_detected": True,
                            "message": "Predicted label sent to RabbitMQ. Anomaly detected.",
                        }
                    ),
                    200,
                )
            else:
                # After successfully sending to RabbitMQ, run consume function in a separate thread
                consume_thread = threading.Thread(
                    target=consume_from_rabbitmq, args=(RABBITMQ_QUEUE,)
                )
                consume_thread.start()

                return (
                    jsonify(
                        {
                            "predicted_label": predicted_label,
                            "confidence": float(confidence),
                            "anomaly_detected": False,
                            "message": "Predicted label sent to RabbitMQ.",
                        }
                    ),
                    200,
                )
        else:
            return jsonify({"error": "Failed to send message to RabbitMQ"}), 500

    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
