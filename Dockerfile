FROM node:lts

WORKDIR /src/usr/app
COPY package.json .
COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "run", "prod"]

