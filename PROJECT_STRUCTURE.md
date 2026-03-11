# API Test Generator - Project Structure

This document describes the complete directory structure following DevOps best practices.

## Directory Tree

```
API-TEST-GENERATOR/
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                    # GitHub Actions CI/CD pipeline
│
├── docs/
│   ├── project-plan.md                  # Project planning and requirements
│   ├── design-document.md               # Technical design specifications
│   ├── user-guide.md                    # End-user documentation
│   └── api-documentation.md             # API endpoint documentation
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile                   # Docker image definition
│   │   └── docker-compose.yml           # Docker Compose configuration
│   │
│   └── kubernetes/
│       ├── deployment.yaml              # K8s deployment manifest
│       ├── service.yaml                 # K8s service manifest
│       ├── configmap.yaml               # K8s configuration
│       ├── ingress.yaml                 # K8s ingress rules
│       └── README.md                    # K8s deployment guide
│
├── monitoring/
│   ├── nagios/
│   │   └── api-test-generator.cfg       # Nagios monitoring config
│   ├── alerts/
│   │   └── alert-rules.yaml             # Prometheus alert rules
│   ├── dashboards/
│   │   └── grafana-dashboard.json       # Grafana dashboard
│   ├── health-check.sh                  # Health check script
│   ├── prometheus.yml                   # Prometheus configuration
│   └── README.md                        # Monitoring setup guide
│
├── src/
│   ├── main/
│   │   ├── config/
│   │   │   └── config.yaml              # Application configuration
│   │   ├── static/
│   │   │   ├── index.html               # Frontend UI
│   │   │   ├── style.css                # Styles
│   │   │   └── script.js                # Frontend JavaScript
│   │   ├── __init__.py
│   │   ├── app.py                       # Flask REST API
│   │   ├── parser.py                    # SwaggerParser class
│   │   └── test_generator.py            # APITestGenerator class
│   │
│   ├── scripts/
│   │   └── generate_tests.py            # CLI test generation script
│   │
│   └── test/
│       └── __init__.py
│
├── tests/
│   ├── unit/
│   │   ├── __init__.py
│   │   └── test_swagger_parser.py       # Parser unit tests
│   ├── integration/
│   │   ├── __init__.py
│   │   └── test_app.py                  # API integration tests
│   ├── selenium/
│   │   ├── __init__.py
│   │   └── test_ui.py                   # UI automation tests
│   └── __init__.py
│
├── .dockerignore                        # Docker ignore patterns
├── .env.example                         # Environment variables template
├── .gitignore                           # Git ignore patterns
├── Makefile                             # Build and deployment commands
├── README.md                            # Main project documentation
├── requirements.txt                     # Python dependencies
└── PROJECT_STRUCTURE.md                 # This file
```

## Key Components

### Application Code (`src/main/`)
- **app.py**: Flask REST API with endpoints for test generation
- **parser.py**: Parses OpenAPI/Swagger specifications
- **test_generator.py**: Generates pytest test code
- **config/**: Application configuration files
- **static/**: Frontend HTML, CSS, and JavaScript

### Tests (`tests/`)
- **unit/**: Unit tests for individual components
- **integration/**: Integration tests for API endpoints
- **selenium/**: UI automation tests

### Infrastructure (`infrastructure/`)
- **docker/**: Docker containerization files
- **kubernetes/**: Kubernetes deployment manifests

### Monitoring (`monitoring/`)
- **nagios/**: Nagios monitoring configuration
- **alerts/**: Prometheus alert rules
- **dashboards/**: Grafana dashboards
- **health-check.sh**: Health check script

### Documentation (`docs/`)
- **project-plan.md**: Project requirements and planning
- **design-document.md**: Technical architecture and design
- **user-guide.md**: User documentation
- **api-documentation.md**: API reference

### CI/CD (`.github/workflows/`)
- **ci-cd.yml**: Automated build, test, and deployment pipeline

## Quick Start

### Local Development
```bash
# Install dependencies
pip install -r requirements.txt

# Run application
python src/main/app.py
```

### Docker
```bash
# Build and run
make docker-build
make docker-run

# Or use docker-compose
docker-compose -f infrastructure/docker/docker-compose.yml up
```

### Kubernetes
```bash
# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/
```

### Testing
```bash
# Run all tests
pytest tests/

# Run specific test suites
pytest tests/unit/
pytest tests/integration/
pytest tests/selenium/
```

## Access Points

- **API**: http://localhost:8080
- **UI**: http://localhost:8080/ui
- **Health Check**: http://localhost:8080/health
- **API Info**: http://localhost:8080/

## Technology Stack

- **Backend**: Python 3.11, Flask
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Testing**: pytest, Selenium
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus, Grafana, Nagios

## Best Practices Implemented

1. **Separation of Concerns**: Clear separation between application code, tests, infrastructure, and documentation
2. **Configuration Management**: Centralized configuration in `config.yaml`
3. **Container Security**: Non-root user, health checks, resource limits
4. **Test Organization**: Separate unit, integration, and UI tests
5. **Monitoring**: Comprehensive monitoring with alerts and dashboards
6. **Documentation**: Clear, structured documentation for all components
7. **CI/CD**: Automated testing and deployment pipeline
8. **Infrastructure as Code**: Kubernetes manifests for reproducible deployments
