FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Kita arahkan jalurnya ke dalam folder backend/server.js
CMD ["node", "backend/server.js"]