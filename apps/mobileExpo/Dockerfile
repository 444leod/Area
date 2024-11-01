FROM saschpe/android-ndk:35-jdk22.0.2_9-ndk27.0.12077973-cmake3.22.1

ARG SKIP_MOBILE_COMPILATION=0

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

COPY . .

RUN sh ./build.sh $SKIP_MOBILE_COMPILATION