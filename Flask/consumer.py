from confluent_kafka import Consumer, KafkaError

KAFKA_BROKER = 'localhost:9092'
KAFKA_TOPIC = 'audio-recordings'

consumer = Consumer({
    'bootstrap.servers': KAFKA_BROKER,
    'group.id': 'audio-group',
    'auto.offset.reset': 'earliest'
})

consumer.subscribe([KAFKA_TOPIC])

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
    audio_data = msg.value()
    # Proses audio_data sesuai kebutuhan Anda
    print(f"Received audio data of length: {len(audio_data)} bytes")

consumer.close()
