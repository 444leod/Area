#!/bin/sh

npm install

rm -rf dist/*

npm install --global eas-cli

eas build --local --non-interactive --platform android --profile production --output dist/area.apk