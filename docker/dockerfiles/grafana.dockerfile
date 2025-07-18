FROM grafana/grafana:12.0.2

RUN mkdir -p /etc/grafana/provisioning/datasources

RUN printf '%s\n' \
'apiVersion: 1' \
'datasources:' \
'  - name: Prometheus' \
'    type: prometheus' \
'    access: proxy' \
'    url: http://prometheus:9090' \
'    isDefault: true' \
'  - name: Loki' \
'    type: loki' \
'    access: proxy' \
'    url: http://loki:3100' \
'  - name: Tempo' \
'    type: tempo' \
'    access: proxy' \
'    url: http://tempo:3200' \
> /etc/grafana/provisioning/datasources/datasources.yml
