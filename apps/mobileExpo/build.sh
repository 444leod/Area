#!/bin/sh

set -e

if [ "$1" = "0" ]; then
    echo "Starting mobile build process..."
    if ! command -v npm >/dev/null 2>&1; then
        echo "Error: npm is not installed"
        exit 1
    }
    echo "Installing npm dependencies..."
    npm install

    echo "Cleaning dist directory..."
    rm -rf dist/*

    echo "Installing eas-cli..."
    npm install --global eas-cli
    echo "Building android app..."
    eas build --local --non-interactive --platform android --profile production --output dist/client.apk
    echo "Build completed successfully!"
else
    echo "Skipping mobile compilation (flag=$1)..."
fi