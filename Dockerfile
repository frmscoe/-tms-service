ARG BUILD_IMAGE=node:16
ARG RUN_IMAGE=gcr.io/distroless/nodejs16-debian11:nonroot

FROM ${BUILD_IMAGE} AS builder
LABEL stage=build
# TS -> JS stage

WORKDIR /home/app
COPY ./src ./src
COPY ./package*.json ./
COPY ./tsconfig.json ./
COPY .npmrc ./
ARG GH_TOKEN

RUN npm ci --ignore-scripts
RUN npm run build

FROM ${BUILD_IMAGE} AS dep-resolver
LABEL stage=pre-prod
# To filter out dev dependencies from final build

COPY package*.json ./
COPY .npmrc ./
ARG GH_TOKEN
RUN npm ci --omit=dev --ignore-scripts

FROM ${RUN_IMAGE} AS run-env
USER nonroot

WORKDIR /home/app
COPY --from=dep-resolver /node_modules ./node_modules
COPY --from=builder /home/app/build ./build
COPY package.json ./
COPY swagger.yaml ./


# Turn down the verbosity to default level.
ENV NPM_CONFIG_LOGLEVEL warn

ENV REST_PORT=3000
ENV FUNCTION_NAME="transaction-monitoring-service-rel-1-0-0"
ENV MAX_CPU=8
ENV DATA_PREPARATION_URL=
ENV DATA_PREPARATION_USERNAME=frm
ENV DATA_PREPARATION_PASSWORD=
ENV NODE_ENV="production"

ENV STARTUP_TYPE=nats
ENV SERVER_URL=0.0.0.0:4222
ENV PRODUCER_STREAM=
ENV ACK_POLICY=Explicit
ENV PRODUCER_STORAGE=File
ENV PRODUCER_RETENTION_POLICY=Workqueue

ENV APM_LOGGING=true
ENV APM_URL=http://apm-server.development:8200
ENV APM_SECRET_TOKEN=

ENV LOGSTASH_HOST="logstash.development:8080"
ENV LOGSTASH_PORT=8080

ENV prefix_logs="false"

HEALTHCHECK --interval=60s CMD [ -e /tmp/.lock ] || exit 1

CMD ["build/server.js"]
