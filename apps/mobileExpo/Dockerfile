FROM saschpe/android-ndk:35-jdk22.0.2_9-ndk27.0.12077973-cmake3.22.1

ARG SKIP_MOBILE_COMPILATION

# Installation des dépendances
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

# Créer le répertoire shared
RUN mkdir -p /shared && chmod 777 /shared

COPY apps/mobileExpo/.env .env
COPY apps/mobileExpo .

RUN chmod +x ./build.sh || echo "Warning: build.sh not found"

# Build pendant la phase de construction
RUN if [ "$SKIP_MOBILE_COMPILATION" = "0" ] && [ -f "./build.sh" ]; then \
        export $(cat .env | xargs) \
        && sh ./build.sh $SKIP_MOBILE_COMPILATION \
        && mkdir -p /shared \
        && cp dist/client.apk /shared/ \
        && chmod 644 /shared/client.apk; \
    else \
        echo "Skipping mobile compilation (SKIP_MOBILE_COMPILATION=$SKIP_MOBILE_COMPILATION)"; \
    fi

# Script pour signaler la complétion
COPY <<EOF /completion-script.sh
#!/bin/sh
echo "Mobile build completed successfully" > /shared/build-complete
touch /shared/client.apk.ready
exit 0
EOF

RUN chmod +x /completion-script.sh

CMD ["/completion-script.sh"]