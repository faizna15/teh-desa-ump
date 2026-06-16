# Gunakan Node.js versi 22 sesuai lingkungan Railway
FROM node:22

# Tentukan folder kerja di dalam server sandbox
WORKDIR /app

# Salin file package untuk instalasi library
COPY package*.json ./

# Paksa install menggunakan perintah biasa (bypass npm ci yang error)
RUN npm install

# Salin semua sisa file projek ke dalam server
COPY . .

# Informasikan port yang digunakan
EXPOSE 5000

# Perintah utama untuk menyalakan backend kamu
CMD ["node", "server.js"]