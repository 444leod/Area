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

# Copier d'abord le .env
COPY apps/mobileExpo/.env .env

# Puis copier le reste des fichiers
COPY apps/mobileExpo .

RUN chmod +x ./build.sh || echo "Warning: build.sh not found"

# Export des variables d'environnement du .env
RUN if [ -f ".env" ]; then \
    export $(cat .env | xargs) \
    && echo "Environment variables loaded from .env"; \
fi

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

CMD ["tail", "-f", "/dev/null"]