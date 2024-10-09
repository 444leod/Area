FROM node:lts-alpine
WORKDIR /app

COPY apps/shared apps/shared
COPY apps/worker apps/worker
COPY mongodb-ca.pem apps/worker
COPY package.json .
COPY tsconfig*.json .


RUN npm i
RUN npm install -g typescript
RUN tsc -b apps/shared

RUN npm run libs:build

CMD npm run worker:start