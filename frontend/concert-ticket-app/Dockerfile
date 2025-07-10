FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# CRA listens on port 3000
EXPOSE 3000

CMD ["npm", "start"]
