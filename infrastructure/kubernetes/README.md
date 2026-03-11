# Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the API Test Generator service.

## Files

- `deployment.yaml` - Deployment configuration with 3 replicas
- `service.yaml` - LoadBalancer service configuration
- `configmap.yaml` - Configuration environment variables
- `ingress.yaml` - Ingress configuration for external access

## Prerequisites

- Kubernetes cluster (v1.20+)
- kubectl configured
- Docker image built and available

## Deployment Steps

### 1. Create ConfigMap
```bash
kubectl apply -f configmap.yaml
```

### 2. Deploy Application
```bash
kubectl apply -f deployment.yaml
```

### 3. Create Service
```bash
kubectl apply -f service.yaml
```

### 4. Setup Ingress (Optional)
```bash
kubectl apply -f ingress.yaml
```

## Verify Deployment

Check pod status:
```bash
kubectl get pods -l app=api-test-generator
```

Check service:
```bash
kubectl get svc api-test-generator
```

View logs:
```bash
kubectl logs -l app=api-test-generator
```

## Scaling

Scale replicas:
```bash
kubectl scale deployment api-test-generator --replicas=5
```

## Health Checks

The deployment includes:
- **Liveness Probe**: Checks if container is alive (restarts if fails)
- **Readiness Probe**: Checks if container is ready to serve traffic

Both probes use the `/health` endpoint.

## Resource Limits

- **Requests**: 256Mi memory, 250m CPU
- **Limits**: 512Mi memory, 500m CPU

Adjust these values in `deployment.yaml` based on your needs.

## Troubleshooting

View events:
```bash
kubectl describe deployment api-test-generator
```

Check pod details:
```bash
kubectl describe pod <pod-name>
```

Access pod shell:
```bash
kubectl exec -it <pod-name> -- /bin/bash
```
