# Monitoring Setup

This directory contains monitoring configurations for the API Test Generator service.

## Directory Structure

```
monitoring/
├── nagios/              # Nagios monitoring configuration
├── alerts/              # Prometheus alert rules
├── dashboards/          # Grafana dashboards
├── health-check.sh      # Health check script
└── prometheus.yml       # Prometheus configuration
```

## Nagios Configuration

The Nagios configuration monitors:
- HTTP health check endpoint
- API response time
- Container status

### Setup
1. Copy `nagios/api-test-generator.cfg` to your Nagios configuration directory
2. Reload Nagios: `sudo systemctl reload nagios`

## Prometheus Alerts

Alert rules are defined in `alerts/alert-rules.yaml` and monitor:
- Service availability
- Response time
- Error rates
- Resource usage (CPU, Memory)
- Container restarts

### Setup
1. Add alert rules to Prometheus configuration
2. Configure Alertmanager for notifications

## Grafana Dashboard

Import the dashboard from `dashboards/grafana-dashboard.json` to visualize:
- Service uptime
- Request rate
- Response time
- Error rate
- Memory and CPU usage

### Import Steps
1. Open Grafana UI
2. Go to Dashboards → Import
3. Upload `grafana-dashboard.json`
4. Select Prometheus data source

## Health Check Script

Run the health check script manually:
```bash
./health-check.sh
```

This script checks:
- Service availability
- Response time
- Container status
