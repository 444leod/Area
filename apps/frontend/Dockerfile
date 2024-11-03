FROM node:lts-alpine
WORKDIR /app

EXPOSE 8081

# Créer les répertoires nécessaires
RUN mkdir -p /shared /app/apps/frontend/static
RUN chmod 777 /shared /app/apps/frontend/static

COPY apps/shared apps/shared
COPY apps/frontend apps/frontend
COPY package.json .
COPY tsconfig*.json .

RUN npm i
RUN npm install -g typescript
RUN tsc -b apps/shared
RUN npm run front:build

ENV HOST=0.0.0.0

# Script pour démarrer le serveur
COPY <<EOF /start.sh
#!/bin/sh
if [ -f "/shared/client.apk" ]; then
    echo "Copying APK to static directory..."
    cp /shared/client.apk /app/apps/frontend/static/
    echo "APK copied successfully"
    ls -l /app/apps/frontend/static/client.apk
else
    echo "Warning: No APK found in shared volume"
fi
npm run front:start
EOF

RUN chmod +x /start.sh
CMD ["/start.sh"]