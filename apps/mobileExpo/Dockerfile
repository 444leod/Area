# Use ARM64 compatible base image
FROM --platform=linux/arm64 ubuntu:20.04
LABEL maintainer="vitor.roberto3022@gmail.com"
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install dependencies
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    git \
    build-essential \
    wget \
    unzip \
    make \
    sudo \
    libxrender1 \
    libxtst6 \
    libxi6 \
    libfreetype6 \
    libxft2 \
    xz-utils \
    qemu \
    qemu-user-static \
    binfmt-support \
    libvirt-daemon-system \
    libvirt-clients \
    bridge-utils \
    libnotify4 \
    libglu1-mesa \
    libqt5widgets5 \
    xvfb \
    file \
    libc6-amd64-cross \
    && rm -rf /var/lib/apt/lists/*

# Install OpenJDK 17
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    rm -rf /var/lib/apt/lists/*

# Add NodeSource APT repository for Node.js and install Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g eas-cli sharp-cli

# Setup folder to store the expo apps
WORKDIR /home/expo_apps

# Install Android SDK
ENV ANDROID_HOME=/usr/local/android-sdk
ENV PATH="${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools"

RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip -O android-commandline-tools.zip && \
    unzip -q android-commandline-tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm android-commandline-tools.zip

# Accept licenses and install Android SDK components
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" && \
    sdkmanager --install "ndk;25.2.9519653"

ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/25.2.9519653
ENV PATH="${PATH}:${ANDROID_NDK_HOME}"

# Set JAVA_HOME correctly and verify its existence
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-arm64
ENV PATH="${PATH}:${JAVA_HOME}/bin"

RUN echo "JAVA_HOME is set to: $JAVA_HOME" && \
    ls -l $JAVA_HOME && \
    java -version

# Setup Gradle
RUN mkdir ~/.gradle \
    && echo 'org.gradle.daemon=true' >> ~/.gradle/gradle.properties \
    && echo 'org.gradle.parallel=true' >> ~/.gradle/gradle.properties \
    && echo 'org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=4096m -XX:+HeapDumpOnOutOfMemoryError' >> ~/.gradle/gradle.properties

# Copy project files
COPY . .

# Set environment variables from .env file
ENV EXPO_PUBLIC_API_URL="http://192.168.1.25:3000"
ENV EXPO_PUBLIC_GOOGLE_CLIENT_ID="825177499555-l1gkngu2n3okinepggamb40marvkr39p.apps.googleusercontent.com"

# Install project dependencies
RUN npm install

# Create a script to run the EAS build
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting build script"\n\
echo "EXPO_TOKEN is ${EXPO_TOKEN:+set}${EXPO_TOKEN:-not set}"\n\
if [ -z "$EXPO_TOKEN" ]; then\n\
    echo "EXPO_TOKEN is not set. Please provide it when running the container."\n\
    exit 1\n\
fi\n\
echo "JAVA_HOME is set to: $JAVA_HOME"\n\
echo "Contents of JAVA_HOME:"\n\
ls -l $JAVA_HOME\n\
echo "Java version:"\n\
java -version\n\
echo "System architecture:"\n\
uname -a\n\
echo "AAPT2 version and details:"\n\
find $ANDROID_HOME -name aapt2 -type f -exec file {} \\;\n\
echo "Running EAS build command"\n\
export ANDROID_HOME=$ANDROID_HOME\n\
export JAVA_HOME=$JAVA_HOME\n\
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/build-tools/33.0.0\n\
eas build -p android --profile production --non-interactive --local\n\
echo "Build command completed"\n\
' > /home/expo_apps/run_build.sh && chmod +x /home/expo_apps/run_build.sh

# Set the entrypoint to our build script
ENTRYPOINT ["/home/expo_apps/run_build.sh"]