FROM node:16.17.1-alpine3.15

WORKDIR /app

COPY apps/mobileExpo .

ARG SKIP_MOBILE_COMPILATION=0

RUN if [ "$SKIP_MOBILE_COMPILATION" = "0" ]; then \
      npm install -g expo-cli eas-cli && \
      npm i && \
      apk add git jq && \
      git init; \
    else \
      echo "Skipping installation and initialization steps"; \
    fi

RUN sh ./build.sh $SKIP_MOBILE_COMPILATION

RUN mkdir -p /shared

RUN mv client.apk /shared

CMD echo "APK is ready"