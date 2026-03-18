# API Test Generator from OpenAPI / Swagger Specifications

**Student Name:** Nemat Sachdeva  
**Course:** CSE3253 DevOps  
**Semester:** VI  
**Project Type:** DevOps Automation Tool

---

## 📋 Project Overview

The **API Test Generator** is a DevOps automation tool that automatically generates pytest-based API test cases from OpenAPI 3.0 or Swagger 2.0 specifications. This tool eliminates manual test creation, accelerates the QA process, and seamlessly integrates into CI/CD pipelines.

### Workflow

```
OpenAPI / Swagger File
         ↓
SwaggerParser extracts endpoints
         ↓
APITestGenerator creates pytest tests
         ↓
pytest executes API tests
         ↓
Automated validation & reporting
```

### Benefits

- ✅ **Automated API Testing** - Generate tests automatically from specifications
- ✅ **Faster QA Process** - Reduce test creation time from hours to seconds
- ✅ **DevOps Pipeline Integration** - Seamlessly integrate with CI/CD workflows
- ✅ **Reduced Manual Effort** - Eliminate repetitive test writing tasks
- ✅ **Consistent Test Coverage** - Ensure all endpoints are tested
- ✅ **Specification-Driven** - Tests stay in sync with API documentation

---

## ✨ Features

- 🔍 **Parse OpenAPI 3.0 and Swagger 2.0 specifications**
- 🎯 **Extract API endpoints automatically** with methods, parameters, and responses
- 🧪 **Generate production-ready pytest test cases** with status code validation
- ▶️ **Run Tests Directly from UI** - Execute pytest dynamically and view results in real-time
- 📋 **Copy & Download Generated Tests** - Easy code sharing and file management
- 🌐 **Web UI for uploading Swagger files** with drag-and-drop support
- 🐳 **Docker containerized application** for consistent deployment
- 🔄 **CI/CD pipeline using GitHub Actions** with 5-stage automation
- 📊 **Monitoring configuration** using Prometheus, Nagios, and Grafana
- ☸️ **Kubernetes deployment manifests** for production orchestration
- 📝 **REST API endpoints** for programmatic test generation
- 🎨 **Modern dark-themed UI** with responsive design and test result visualization

---

## 🏗️ Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User / CI/CD Pipeline                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   Web UI / REST API                          │
│                    (Flask Backend)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  SwaggerParser (Python)                      │
│         • Parses OpenAPI 3.0 / Swagger 2.0                  │
│         • Extracts endpoints, methods, parameters           │
│         • Validates specification structure                 │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│               APITestGenerator (Python)                      │
│         • Generates pytest test functions                   │
│         • Creates status code assertions                    │
│         • Adds endpoint logging                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  Generated pytest Tests                      │
│         • test_get_endpoint_1()                             │
│         • test_post_endpoint_2()                            │
│         • test_put_endpoint_3()                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              CI/CD Pipeline Execution                        │
│         • Automated test execution                          │
│         • Coverage reporting                                │
│         • Docker image building                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Backend
- **Python 3.11** - Core programming language
- **Flask 3.0** - Web framework for REST API
- **PyYAML 6.0** - YAML parsing for Swagger files
- **jsonschema 4.20** - JSON validation

### Testing
- **pytest 7.4** - Test framework
- **requests 2.31** - HTTP client for API testing
- **pytest-cov** - Code coverage reporting
- **selenium 4.15** - UI automation testing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD automation
- **Kubernetes** - Container orchestration (manifests included)

### Monitoring
- **Prometheus** - Metrics collection and alerting
- **Nagios** - System monitoring
- **Grafana** - Visualization dashboards

### Code Quality
- **flake8** - Linting
- **black** - Code formatting
- **isort** - Import sorting
- **pylint** - Static code analysis

---

## 📁 Repository Structure

```
API-TEST-GENERATOR/
│
├── src/main/                          # Application source code
│   ├── app.py                         # Flask REST API server
│   ├── parser.py                      # SwaggerParser class
│   ├── test_generator.py              # APITestGenerator class
│   ├── config/                        # Configuration files
│   │   └── config.yaml                # Application settings
│   └── static/                        # Frontend UI
│       ├── index.html                 # Main UI page
│       ├── style.css                  # Styles (dark theme)
│       └── script.js                  # Frontend JavaScript
│
├── tests/                             # Test suite
│   ├── unit/                          # Unit tests
│   │   └── test_swagger_parser.py     # Parser tests
│   ├── integration/                   # Integration tests
│   │   └── test_app.py                # API endpoint tests
│   └── selenium/                      # UI automation tests
│       └── test_ui.py                 # Selenium tests
│
├── infrastructure/                    # Infrastructure as Code
│   ├── docker/                        # Docker configuration
│   │   ├── Dockerfile                 # Container image definition
│   │   └── docker-compose.yml         # Service orchestration
│   └── kubernetes/                    # Kubernetes manifests
│       ├── deployment.yaml            # Deployment (3 replicas)
│       ├── service.yaml               # LoadBalancer service
│       ├── configmap.yaml             # Configuration
│       └── ingress.yaml               # Ingress rules
│
├── monitoring/                        # Monitoring configuration
│   ├── nagios/                        # Nagios config
│   │   └── api-test-generator.cfg     # Service monitoring
│   ├── alerts/                        # Prometheus alerts
│   │   └── alert-rules.yaml           # Alert definitions
│   ├── dashboards/                    # Grafana dashboards
│   │   └── grafana-dashboard.json     # Visualization
│   ├── health-check.sh                # Health check script
│   └── prometheus.yml                 # Prometheus config
│
├── docs/                              # Project documentation
│   ├── project-plan.md                # Project planning
│   ├── design-document.md             # Technical design
│   ├── user-guide.md                  # User documentation
│   └── api-documentation.md           # API reference
│
├── .github/workflows/                 # CI/CD pipeline
│   └── ci-cd.yml                      # GitHub Actions workflow
│
├── pytest.ini                         # Pytest configuration
├── requirements.txt                   # Python dependencies
├── Makefile                           # Build commands
├── .gitignore                         # Git ignore patterns
├── .dockerignore                      # Docker ignore patterns
└── README.md                          # This file
```

---

## 🚀 Installation and Setup

### Prerequisites

- Python 3.11 or higher
- pip (Python package manager)
- Git
- Docker (optional, for containerized deployment)

### Local Setup

#### 1. Clone Repository

```bash
git clone https://github.com/NematSachdeva/API-Test-Generator.git
cd API-Test-Generator
```

#### 2. Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Run Application

```bash
python src/main/app.py
```

#### 5. Access Application

Open your browser and navigate to:
- **Web UI**: http://localhost:8080/ui
- **API Docs**: http://localhost:8080/
- **Health Check**: http://localhost:8080/health

---

## 🐳 Running with Docker

### Using Makefile (Recommended)

```bash
# Build Docker image
make docker-build

# Run container
make docker-run

# Access UI
# Open http://localhost:8080/ui in your browser

# View logs
make docker-logs

# Stop container
make docker-stop

# Clean up
make docker-clean
```

### Using Docker Commands

```bash
# Build Docker image
docker build -f infrastructure/docker/Dockerfile -t api-test-generator:latest .

# Run container
docker run -d -p 8080:8080 --name api-test-generator api-test-generator:latest

# Access UI
# Open http://localhost:8080/ui

# View logs
docker logs -f api-test-generator

# Stop and remove container
docker stop api-test-generator
docker rm api-test-generator
```

### Using Docker Compose

```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

---

## 🧪 Running Generated Tests

### From the Web UI

The API Test Generator now includes a **Run Tests** feature directly in the web interface:

1. **Generate Tests**
   - Upload your Swagger/OpenAPI file
   - Click "Generate Tests"
   - Tests appear in the code viewer

2. **Run Tests from UI**
   - Click the **"Run Tests"** button
   - Backend executes pytest dynamically
   - Results display in real-time with:
     - ✅ Test summary card (passed, failed, total)
     - 📋 Individual test results with status
     - 🖥️ Environment info (Python, pytest versions)
     - 📊 Execution time
     - 🔍 Console output (collapsible)

3. **View Results**
   - Green checkmarks for passed tests
   - Red X marks for failed tests
   - Click "View Code" to see generated test code again
   - Click "View Console Output" for detailed pytest output

### From Command Line

#### Install pytest and requests

```bash
pip install pytest requests
```

#### Run Tests

```bash
# Run all tests
pytest generated_tests.py

# Run with verbose output
pytest generated_tests.py -v

# Run with detailed output
pytest generated_tests.py -vv

# Run with coverage
pytest generated_tests.py --cov=. --cov-report=html
```

#### Example Output

```
generated_tests.py::test_get_users_1 PASSED                    [ 33%]
generated_tests.py::test_post_users_2 PASSED                   [ 66%]
generated_tests.py::test_get_users_id_3 PASSED                 [100%]

========================= 3 passed in 0.45s =========================
```

### What the Tests Validate

The generated tests automatically:
- ✅ Send HTTP requests to each endpoint
- ✅ Validate response status codes (200, 201, 404, etc.)
- ✅ Print endpoint names for debugging
- ✅ Use the requests library for HTTP calls
- ✅ Follow pytest conventions and best practices

### Backend Run Tests API

The backend provides a `/run-tests` endpoint for programmatic test execution:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"test_code": "import pytest\n..."}' \
  http://localhost:8080/run-tests
```

**Response:**
```json
{
  "stdout": "===== test session starts =====\n...",
  "stderr": "",
  "returncode": 0,
  "passed": true,
  "summary": "3 passed in 0.45s"
}
```

---

## 📝 Generating API Tests

### Using Web UI

1. **Open the UI**
   - Navigate to http://localhost:8080/ui

2. **Upload Swagger/OpenAPI File**
   - Drag and drop your `.json` or `.yaml` file
   - Or click "browse" to select a file

3. **Click "Generate Tests"**
   - Wait for processing (usually < 1 second)

4. **Download Generated Tests**
   - Click "Download" button
   - Or click "Copy" to copy to clipboard
   - Save as `generated_tests.py`

### Using REST API

#### Generate Tests from File

```bash
curl -X POST \
  -F "file=@swagger.json" \
  http://localhost:8080/generate-tests \
  | jq -r '.test_code' > generated_tests.py
```

#### Generate Tests from JSON Body

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d @swagger.json \
  http://localhost:8080/generate-tests \
  | jq -r '.test_code' > generated_tests.py
```

#### Parse Endpoints Only

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d @swagger.json \
  http://localhost:8080/parse
```

---

## 🧪 Running Generated Tests

### Install pytest and requests

```bash
pip install pytest requests
```

### Run Tests

```bash
# Run all tests
pytest generated_tests.py

# Run with verbose output
pytest generated_tests.py -v

# Run with detailed output
pytest generated_tests.py -vv
```

### Example Output

```
generated_tests.py::test_get_users_1 PASSED                    [ 33%]
generated_tests.py::test_post_users_2 PASSED                   [ 66%]
generated_tests.py::test_get_users_id_3 PASSED                 [100%]

========================= 3 passed in 0.45s =========================
```

### What the Tests Validate

The generated tests automatically:
- ✅ Send HTTP requests to each endpoint
- ✅ Validate response status codes (200, 201, 404, etc.)
- ✅ Print endpoint names for debugging
- ✅ Use the requests library for HTTP calls
- ✅ Follow pytest conventions and best practices

---

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions CI/CD pipeline that runs automatically on every push and pull request.

### Pipeline Stages

#### 1️⃣ Install Dependencies
- Sets up Python 3.11 environment
- Installs all packages from `requirements.txt`
- Caches pip packages for faster builds
- Verifies installations (Flask, pytest, PyYAML, requests, selenium)

#### 2️⃣ Lint Checks
- **flake8** - Code style validation
- **black** - Code formatting check
- **isort** - Import sorting validation
- **pylint** - Static code analysis

#### 3️⃣ Run Tests
- Executes pytest test suite (unit + integration)
- Sets PYTHONPATH for module imports
- Generates code coverage reports
- Uploads coverage to Codecov
- **Result**: 13 tests pass, 3 skipped (Selenium in CI)

#### 4️⃣ Build Docker Image
- Sets up Docker Buildx
- Builds container image with caching
- Extracts metadata for tagging
- Validates successful build

#### 5️⃣ Push Docker Artifact
- Pushes image to GitHub Container Registry
- Only runs on `main` and `develop` branches
- Tags with branch name, version, and commit SHA
- Authenticates with GitHub token

### Pipeline Triggers

The pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

### Viewing Pipeline Status

1. Go to: https://github.com/NematSachdeva/API-Test-Generator
2. Click the **"Actions"** tab
3. View workflow runs and their status
4. Click on a run to see detailed logs

### Local Testing Before Push

```bash
# Run tests locally
./run_tests.sh all

# Run linting
flake8 src/ tests/ --max-line-length=120

# Check formatting
black --check src/ tests/

# Run tests with coverage
pytest tests/ --cov=src/main --cov-report=html
```

---

## 📊 Monitoring

The project includes comprehensive monitoring configuration for production deployments.

### Prometheus for Metrics

- **Location**: `monitoring/prometheus.yml`
- **Purpose**: Collects application metrics
- **Metrics**:
  - Request rate
  - Response time
  - Error rate
  - CPU and memory usage

### Nagios for System Monitoring

- **Location**: `monitoring/nagios/api-test-generator.cfg`
- **Purpose**: System health monitoring
- **Checks**:
  - HTTP health endpoint
  - API response time
  - Container status
  - Service availability

### Grafana Dashboards for Visualization

- **Location**: `monitoring/dashboards/grafana-dashboard.json`
- **Purpose**: Visual monitoring dashboards
- **Panels**:
  - Service uptime
  - Request rate graph
  - Response time graph
  - Error rate graph
  - Memory usage
  - CPU usage

### Alert Rules

- **Location**: `monitoring/alerts/alert-rules.yaml`
- **Alerts**:
  - Service down (critical)
  - High response time (warning)
  - High error rate (warning)
  - High memory usage (warning)
  - High CPU usage (warning)
  - Container restarting (warning)

---

## 🚀 Future Improvements

### Planned Enhancements

1. **Smarter Request Payload Generation**
   - Automatically generate request bodies from schema
   - Support for complex nested objects
   - Faker integration for realistic test data

2. **Dynamic Parameter Handling**
   - Auto-generate path parameters
   - Query parameter combinations
   - Header and cookie handling

3. **Response Schema Validation**
   - Validate response structure against OpenAPI schema
   - Check data types and required fields
   - Validate response examples

4. **Automatic API Mocking**
   - Generate mock servers from specifications
   - Support for contract testing
   - Integration with Postman/Insomnia

5. **Full Selenium UI Automation**
   - Complete UI test coverage
   - Cross-browser testing
   - Visual regression testing

6. **Advanced Features**
   - Authentication token management
   - Rate limiting tests
   - Performance testing integration
   - GraphQL support
   - gRPC support

---

## 📚 Documentation

For detailed information, refer to:

- **[Project Plan](docs/project-plan.md)** - Project roadmap and timeline
- **[Design Document](docs/design-document.md)** - Architecture and design patterns
- **[User Guide](docs/user-guide.md)** - Step-by-step usage instructions
- **[API Documentation](docs/api-documentation.md)** - Complete REST API reference

---

## 🧪 Running Tests Locally

### Using Test Runner Script

```bash
# Run all tests
./run_tests.sh all

# Run unit tests only
./run_tests.sh unit

# Run integration tests only
./run_tests.sh integration

# Run with coverage report
./run_tests.sh coverage
```

### Using pytest Directly

```bash
# Set PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)/src/main

# Run all tests
pytest tests/ -v

# Run specific test suite
pytest tests/unit/ -v
pytest tests/integration/ -v

# Run with coverage
pytest tests/ --cov=src/main --cov-report=html
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>
```

### Module Import Errors

```bash
# Set PYTHONPATH
export PYTHONPATH=$PYTHONPATH:$(pwd)/src/main

# Or run with the test script
./run_tests.sh all
```

### Docker Issues

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -f infrastructure/docker/Dockerfile -t api-test-generator:latest .
```

---

## 📞 Support

For issues, questions, or suggestions:

1. Check the [documentation](docs/)
2. Review the [troubleshooting](#-troubleshooting) section
3. Open an issue on [GitHub](https://github.com/NematSachdeva/API-Test-Generator/issues)

---

## 📄 License

This project is created for educational purposes as part of the CSE3253 DevOps course.

---

## 🎓 Academic Information

**Project**: API Test Generator from OpenAPI/Swagger Specifications  
**Student**: Nemat Sachdeva  
**Course**: CSE3253 DevOps  
**Semester**: VI  
**Institution**: [Your University Name]  
**Year**: 2026

---

## 🙏 Acknowledgments

- OpenAPI Initiative for specification standards
- Flask community for the web framework
- pytest community for the testing framework
- Docker for containerization technology
- GitHub for CI/CD infrastructure

---

## 📊 Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pip install -r requirements.txt` |
| Run application | `python src/main/app.py` |
| Access UI | http://localhost:8080/ui |
| Run tests | `./run_tests.sh all` |
| Build Docker image | `make docker-build` |
| Run Docker container | `make docker-run` |
| View logs | `make docker-logs` |
| Stop container | `make docker-stop` |
| Run linting | `flake8 src/ tests/` |
| Format code | `black src/ tests/` |
| Generate coverage | `pytest tests/ --cov=src/main` |

---

**Made with ❤️ for DevOps Automation**
