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

# Install dependencies first
RUN npm i
RUN npm install -g typescript

# Compile shared typescript
RUN tsc -b apps/shared

# Modified startup script to handle APK first
COPY <<EOF /start.sh
#!/bin/sh

# Wait for APK and copy it first
while [ ! -f /shared/client.apk.ready ]; do
    echo "Waiting for APK..."
    sleep 2
done

echo "APK is ready, copying to static directory..."
cp /shared/client.apk /app/apps/frontend/static/
chmod 644 /app/apps/frontend/static/client.apk

# Now build and start the application
echo "Building frontend application..."
npm run front:build

echo "Starting frontend application..."
exec npm run front:start
EOF

RUN chmod +x /start.sh

ENV HOST=0.0.0.0

CMD ["/start.sh"]