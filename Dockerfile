FROM node:16 AS builder
LABEL stage=build

# Create a folder named function
RUN mkdir -p /home/app

# Wrapper/boot-strapper
WORKDIR /home/app

COPY ./src ./src
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
COPY ./.npmrc ./
ENV GH_TOKEN=

# Install dependencies for production
RUN npm ci --omit=dev --ignore-scripts

# Build the project
RUN npm run build
COPY ./swagger.yaml ./build

FROM gcr.io/distroless/nodejs16-debian11:nonroot
USER nonroot

COPY --from=builder /home/app /home/app

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /home/app

ENV REST_PORT=3000
ENV FUNCTION_NAME="transaction-monitoring-service-rel-1-0-0"
ENV MAX_CPU=8
ENV DATA_PREPARATION_URL=
ENV DATA_PREPARATION_USERNAME=frm
ENV DATA_PREPARATION_PASSWORD=
ENV NODE_ENV="production"

ENV APM_LOGGING=true
ENV APM_URL=http://apm-server.development:8200
ENV APM_SECRET_TOKEN=

ENV LOGSTASH_HOST="logstash.development:8080"
ENV LOGSTASH_PORT=8080

ENV prefix_logs="false"

HEALTHCHECK --interval=60s CMD [ -e /tmp/.lock ] || exit 1

CMD ["build/server.js"]
