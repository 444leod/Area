FROM node:lts-alpine
WORKDIR /app
COPY worker/tsconfig.json .
COPY worker/package.json .
RUN npm i
COPY worker/src src
COPY shared shared
RUN npm run build
CMD npm run start
