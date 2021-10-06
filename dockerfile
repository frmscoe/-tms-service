FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.8.4 as watchdog
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:14-alpine as ship

ARG TARGETPLATFORM
ARG BUILDPLATFORM

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

RUN addgroup -S app && adduser -S -g app app

RUN apk --no-cache add curl ca-certificates

# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

# Create a folder named function
RUN mkdir -p /home/app

# Wrapper/boot-strapper
WORKDIR /home/app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
COPY ./mojaloop-api.yaml ./

# Install dependencies
RUN npm install

COPY ./src ./src

# Build the project
RUN npm run build

# Environment variables for openfaas
ENV cgi_headers="true"
ENV fprocess="node ./build/server.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"

ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"

ENV prefix_logs="false"

# Service-Based Enviroment Variables
ENV FUNCTION_NAME="transaction-monitoring-service"
ENV NODE_ENV="prod"
ENV REST_PORT=3000
ENV GRPC_PORT=50051

ENV DATA_PREPARATION_URL="http://nifi.development:8081"
ENV DATA_PREPARATION_USERNAME="frm"
ENV DATA_PREPARATION_PASSWORD="GeJj2BzCC2VNZ3zdMcE5"

ENV LOGSTASH_HOST=127.0.0.1
ENV LOGSTASH_PORT=3000

ENV APM_LOGGING=true
ENV APM_URL=http://apm-server-apm-server.frm:8200
ENV APM_SECRET_TOKEN=


HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1

# Execute watchdog command
CMD ["fwatchdog"]
