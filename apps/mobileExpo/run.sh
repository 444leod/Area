set -e
echo "Searching for APK..."
ls -l dist/client.apk
echo "Copying to shared directory..."
cp dist/client.apk /shared/client.apk
echo "Hanging till death..."
tail -f /dev/null
