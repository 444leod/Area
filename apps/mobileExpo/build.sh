#!/bin/sh

set -e

echo "Starting mobile build process..."
echo "Installing npm dependencies..."
npm i --legacy-peer-deps

echo "Cleaning dist directory..."
rm -rf dist/*

echo "Installing eas-cli..."
npm install --global eas-cli
echo "Building android app..."
eas build --local --non-interactive --platform android --profile production --output dist/client.apk
echo "Build completed successfully!"
