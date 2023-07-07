# Stage 1: Build stage
FROM --platform=${TARGETPLATFORM:-linux/amd64} ghcr.io/openfaas/of-watchdog:0.9.12 as watchdog
FROM --platform=${TARGETPLATFORM:-linux/amd64} node:18.16-alpine as build

ARG TARGETPLATFORM
ARG BUILDPLATFORM

COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
RUN chmod +x /usr/bin/fwatchdog

# Create new group and user called app
RUN addgroup -S app && adduser -S -g app app

# Upgrade all packages
RUN apk --no-cache update && \
    apk --no-cache upgrade && \
    apk --no-cache add curl ca-certificates

# Set working directory
WORKDIR /home/app

# Copy dependencies manifests
COPY package*.json ./
COPY tsconfig.json ./
COPY swagger.yaml ./

# Install dependencies
RUN npm install

# Copy application source code
COPY ./src ./src

# Build the project
RUN npm run build

# Copy built artifacts from the previous stage
COPY --from=build /home/app ./

# Set environment variables
ENV cgi_headers="true"
ENV fprocess="node ./build/server.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV exec_timeout="45s"
ENV write_timeout="15s"
ENV read_timeout="15s"
ENV prefix_logs="false"
ENV FUNCTION_NAME="transaction-monitoring-service-rel-1-0-0"
ENV NODE_ENV="production"
ENV REST_PORT=3000
ENV MAX_CPU=8
ENV DATA_PREPARATION_URL=
ENV DATA_PREPARATION_USERNAME=frm
ENV DATA_PREPARATION_PASSWORD=
ENV APM_LOGGING=true
ENV APM_URL=http://apm-server.development:8200
ENV APM_SECRET_TOKEN=
ENV LOGSTASH_HOST=logstash.development:8080
ENV LOGSTASH_PORT=8080

# Set healthcheck command
HEALTHCHECK --interval=60s CMD [ -e /tmp/.lock ] || exit 1

# Execute watchdog command
CMD ["fwatchdog"]
