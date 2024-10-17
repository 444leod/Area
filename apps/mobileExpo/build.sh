#!/bin/bash

if [ "$1" == "1" ]; then
    echo "Skipping compilation and creating mock apk..."
    echo "This is a mock apk" >> client.apk
    exit 0
elif [ "$1" != "0" ]; then
    printf "Invalid argument: $1\nUSAGE:\n\t$0 [0|1]"
    exit 1
fi

echo "'$0 1' to skip compilation and create mock apk"
echo "Logging in to EAS..."
export $(grep -v '^#' .env | xargs -0)
mail=$EXPO_USERNAME
password=$EXPO_PASSWORD

echo $mail
echo $password

code=$(npx expo login -u $mail -p $password --non-interactive)
if [ $? -ne 0 ]; then
    echo "Error: expo login failed"
    exit 1
fi
echo "Logged in to expo"

echo "Building the mobile app"
command="eas build -p android --profile preview --non-interactive --wait --json"

json=$($command 1> build.json)

status=$(jq -r '.[0].status' build.json)

if [ "$status" != "FINISHED" ]; then
  echo "Build failed"
  exit 1
fi
echo "Build successful"

buildUrl=$(jq -r '.[0].artifacts.buildUrl' build.json)
echo "Build url: $buildUrl"

echo "Downloading build..."
wget -O client.apk $buildUrl

rm build.json

echo "Build downloaded to public/apk/client.apk"