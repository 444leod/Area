#!/bin/sh

if [ "$1" = "0" ]; then
    npm install
    rm -rf dist/*
    npm install --global eas-cli
    eas build --local --non-interactive --platform android --profile production --output dist/client.apk
else
    echo "Skipping mobile compilation..."
fi