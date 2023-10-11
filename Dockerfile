FROM node:20-alpine3.17

WORKDIR /app

COPY . .

RUN npm install -g npm@latest

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
