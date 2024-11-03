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

# Copier l'APK du volume partagé vers le dossier static pendant le build
COPY --from=mobile-expo /shared/client.apk /app/apps/frontend/static/

RUN npm i
RUN npm install -g typescript
RUN tsc -b apps/shared
RUN npm run front:build

ENV HOST=0.0.0.0

CMD ["npm", "run", "front:start"]