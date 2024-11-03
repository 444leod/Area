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

# Script d'attente et de démarrage
COPY <<EOF /start.sh
#!/bin/sh

# Attendre que l'APK soit prêt
while [ ! -f /shared/client.apk.ready ]; do
    echo "Waiting for APK..."
    sleep 2
done

# Copier l'APK
echo "APK is ready, copying to static directory..."
cp /shared/client.apk /app/apps/frontend/static/
chmod 644 /app/apps/frontend/static/client.apk

# Démarrer l'application
echo "Starting frontend application..."
exec npm run front:start
EOF

RUN chmod +x /start.sh

RUN npm i
RUN npm install -g typescript
RUN tsc -b apps/shared
RUN npm run front:build

ENV HOST=0.0.0.0

CMD ["/start.sh"]