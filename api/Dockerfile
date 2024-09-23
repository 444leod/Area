FROM node:lts-alpine

WORKDIR /app
COPY api/package*.json .
RUN npm i

COPY api .
COPY shared shared
RUN npm run build

CMD npm run start