#!/bin/sh

set -e

echo "Starting mobile build process..."

echo "Exporting env..."
export $(cat .env | xargs)

echo "Installing npm dependencies..."
npm i --legacy-peer-deps

git init

echo "Cleaning dist directory..."
rm -rf dist/*
mkdir -p dist

echo "Installing eas-cli..."
npm install --global eas-cli
echo "Building android app..."
eas build --local --non-interactive --platform android --profile production --output dist/client.apk

echo "Checking if APK was created..."
if [ -f "dist/client.apk" ]; then
    echo "APK successfully created"
    ls -l dist/client.apk
else
    echo "Failed to create APK"
    exit 1
fi

echo "Build completed successfully!"
