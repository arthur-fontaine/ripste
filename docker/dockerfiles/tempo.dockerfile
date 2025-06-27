FROM grafana/tempo:2.8.1

USER root

RUN printf '%s\n' \
'server:' \
'  http_listen_port: 3200' \
'  grpc_listen_port: 4318' \
'' \
'distributor:' \
'  receivers:' \
'    otlp:' \
'      protocols:' \
'        grpc:' \
'          endpoint: 0.0.0.0:4317' \
'' \
'storage:' \
'  trace:' \
'    backend: local' \
'    wal:' \
'      path: /var/tempo/wal' \
'    local:' \
'      path: /var/tempo/blocks' \
'' \
'metrics_generator:' \
'  storage:' \
'    path: /tmp/tempo-metrics-generator-wal' \
'  processor:' \
'    span_metrics:' \
'      dimensions:' \
'        - http.method' \
'        - http.status_code' \
> /etc/tempo.yaml
