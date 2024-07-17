# consumer.py

from confluent_kafka import Consumer, KafkaError
import json

def kafka_consumer(broker, group, topic):
    conf = {
        'bootstrap.servers': broker,
        'group.id': group,
        'auto.offset.reset': 'earliest'
    }

    consumer = Consumer(conf)
    consumer.subscribe([topic])

    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break

        message = msg.value().decode('utf-8')
        print(f"Received message: {message}")

    consumer.close()

if __name__ == "__main__":
    broker = "localhost:9092"
    group = "audio_group"
    topic = "audio_predictions"
    kafka_consumer(broker, group, topic)
