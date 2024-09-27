FROM node:lts-alpine
WORKDIR /app
COPY task_manager/tsconfig.json .
COPY task_manager/package.json .
RUN npm i
COPY task_manager/src src
COPY shared shared
CMD npm run start
