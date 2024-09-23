FROM node:22-alpine

WORKDIR /app

COPY frontend/package.json .
RUN npm i

COPY frontend .
COPY shared shared
RUN npm run build
EXPOSE 4173

# Should be enough for a POC
CMD npm run preview