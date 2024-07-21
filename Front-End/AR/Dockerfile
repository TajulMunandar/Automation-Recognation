# Gunakan image node resmi sebagai image dasar
FROM node:20.12.2

# Tentukan direktori kerja dalam container
WORKDIR /app

# Salin package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Tentukan port yang akan digunakan oleh container
EXPOSE 5173

# Jalankan aplikasi dalam mode pengembangan
CMD ["npm", "run", "dev"]
