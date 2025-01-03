FROM node:22.12.0

WORKDIR /home/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "./app/index.js"]
