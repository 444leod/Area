FROM node:16.17.1-alpine3.15

WORKDIR /app

COPY apps/mobileExpo .

RUN npm install -g expo-cli eas-cli

RUN npm i

RUN apk add git jq

RUN git init

RUN sh ./build.sh

RUN mkdir -p /shared

RUN mv client.apk /shared

CMD echo "APK is ready"