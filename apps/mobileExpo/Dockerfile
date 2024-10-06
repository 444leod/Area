# Use an official Node runtime as the base image
FROM node:lts

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install Expo CLI globally
RUN npm install -g expo-cli

# Install EAS CLI globally
RUN npm install -g eas-cli

# Copy the rest of the application code
COPY . .

# Build the Android app using EAS
CMD ["eas", "build", "--platform", "android", "--non-interactive"]