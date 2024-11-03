#!/bin/sh

set -e

echo "Starting mobile build process..."
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

# Création du répertoire shared et copie de l'APK
mkdir -p /shared
cp dist/client.apk /shared/client.apk
chmod 644 /shared/client.apk

echo "Checking if APK was copied to shared volume..."
if [ -f "/shared/client.apk" ]; then
    echo "APK successfully copied to shared volume"
    ls -l /shared/client.apk
else
    echo "Failed to copy APK to shared volume"
    exit 1
fi