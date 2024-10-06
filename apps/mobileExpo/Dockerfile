# Use Alpine Linux with Node.js
FROM node:18-alpine

# Install necessary packages for building
RUN apk add --no-cache git python3 make g++ bash

# Set the working directory in the container
WORKDIR /app

# Install Expo CLI and EAS CLI globally
RUN npm install -g expo-cli eas-cli

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy project files into the docker image
COPY . .

# Set environment variable for non-interactive build
ENV CI=1

# Build the Expo project locally
CMD eas build -p android --profile production --local --non-interactive --output=/app/build/app-release.apk
