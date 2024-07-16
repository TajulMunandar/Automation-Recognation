# Gunakan image dasar yang sesuai
FROM python:3.8

# Set lingkungan kerja
WORKDIR /app

# Salin file requirements.txt dan install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua file proyek ke dalam container
COPY . .

# Ekspos port yang digunakan oleh Flask
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD ["python", "app.py"]
