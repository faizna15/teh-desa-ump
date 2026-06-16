FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Samakan dengan port pintu masuk dinamis internal Railway
EXPOSE 8080

# Mengarah ke folder backend/server.js
CMD ["node", "backend/server.js"]