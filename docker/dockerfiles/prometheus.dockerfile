FROM prom/prometheus:v3.4.2

USER root

RUN printf '%s\n' \
'global:' \
'  scrape_interval: 15s' \
'' \
'scrape_configs:' \
'  - job_name: "prometheus"' \
'    static_configs:' \
'      - targets: ["localhost:9090"]' \
'  - job_name: "api"' \
'    static_configs:' \
'      - targets: ["api:3000"]' \
> /etc/prometheus/prometheus.yml
