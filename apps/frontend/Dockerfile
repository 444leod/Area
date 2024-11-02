FROM node:lts-alpine
WORKDIR /app

EXPOSE 8081

COPY apps/shared apps/shared
COPY apps/frontend apps/frontend
COPY package.json .
COPY tsconfig*.json .

RUN npm i
RUN npm install -g typescript
RUN tsc -b apps/shared
RUN npm run front:build

ENV HOST=0.0.0.0

CMD mv /shared/client.apk /app/apps/frontend/static; npm run front:start
