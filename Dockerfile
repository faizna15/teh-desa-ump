FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Samakan dengan port internal pintu masuk Railway
EXPOSE 8080

# Jalur eksekusi file utama backend
CMD ["node", "backend/server.js"]