FROM saschpe/android-ndk:35-jdk22.0.2_9-ndk27.0.12077973-cmake3.22.1

ARG SKIP_MOBILE_COMPILATION

# Install deps
RUN if [ "$SKIP_MOBILE_COMPILATION" = "0" ]; then \
    export DEBIAN_FRONTEND=noninteractive \
    && apt-get update -qq \
    && apt-get upgrade -y -qq \
    && apt-get install -y -qq \
        curl \
        unzip \
        nodejs \
        npm; \
fi

WORKDIR /app

COPY apps/mobileExpo/.env .env
COPY apps/mobileExpo .

# Build app or skip
RUN if [ "$SKIP_MOBILE_COMPILATION" = "0" ] && [ -f "./build.sh" ]; then \
        sh ./build.sh $SKIP_MOBILE_COMPILATION \
    else \
        echo "Skipping mobile compilation (SKIP_MOBILE_COMPILATION=$SKIP_MOBILE_COMPILATION)"; \
    fi

# Run script
CMD ./run.sh
