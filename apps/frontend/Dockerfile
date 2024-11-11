FROM node:lts-alpine
WORKDIR /app

EXPOSE 8081

# Create necessary directories
RUN mkdir -p /shared /app/apps/frontend/static
RUN chmod 777 /shared /app/apps/frontend/static

COPY apps/shared apps/shared
COPY apps/frontend apps/frontend
COPY package.json .
COPY tsconfig*.json .

RUN npm i
RUN npm run front:build
ENV HOST=0.0.0.0
CMD ./apps/frontend/run.sh
