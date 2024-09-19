FROM node:lts-alpine
WORKDIR /app
COPY worker/tsconfig.json .
COPY worker/package.json .
RUN npm i
COPY worker/src src
COPY types types
RUN npm run build
CMD npm run start