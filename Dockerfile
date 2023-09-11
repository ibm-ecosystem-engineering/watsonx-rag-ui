FROM registry.access.redhat.com/ubi9/nodejs-18:1-62.1692771036 AS builder

WORKDIR /opt/app-root/src

COPY --chown=default:root . .

RUN mkdir -p /opt/app-root/src/node_modules && \
    ls -lA && \
    npm ci && \
    npm run build

FROM registry.access.redhat.com/ubi9/nginx-122:1-22.1692771040

WORKDIR /opt/app-root/src

COPY --from=builder --chown=default:root /opt/app-root/src/dist .
COPY --chown=default:root config/nginx/* /opt/app-root/etc/nginx.default.d

CMD nginx -g "daemon off;"
