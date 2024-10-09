FROM node:lts-alpine
WORKDIR /app

EXPOSE 8080

COPY apps/shared apps/shared
COPY apps/api apps/api
COPY mongodb-ca.pem apps/api
COPY package.json .
COPY tsconfig*.json .

RUN npm i
RUN npm install -g typescript
RUN tsc -b apps/shared
RUN npm run api:build

CMD npm run api:start