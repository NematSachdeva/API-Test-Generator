# API Test Generator

A comprehensive DevOps project that automatically generates pytest-based API test cases from OpenAPI/Swagger specifications. This tool streamlines API testing by parsing specification files and generating production-ready test code with minimal configuration.

## Problem Statement

Manual API test creation is time-consuming and error-prone. Teams need a way to:
- Quickly generate test cases from API specifications
- Ensure consistent test coverage across endpoints
- Reduce manual testing effort
- Maintain tests as specifications evolve

The API Test Generator solves this by automating test generation from OpenAPI/Swagger specs, enabling teams to focus on test logic rather than boilerplate code.

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend | Python 3.11 + Flask 3.0 |
| Testing | pytest 7.4 |
| API Parsing | PyYAML 6.0, jsonschema 4.20 |
| HTTP Client | requests 2.31 |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Code Quality | flake8, black, isort, pylint |

## Project Structure

```
api-test-generator/
├── src/
│   ├── main/
│   │   ├── app.py                 # Flask REST API
│   │   ├── parser.py              # OpenAPI/Swagger parser
│   │   └── test_generator.py      # Test code generator
│   ├── scripts/
│   │   └── generate_tests.py      # CLI test generation script
│   └── test/
├── tests/
│   ├── test_app.py                # API endpoint tests
│   └── test_swagger_parser.py     # Parser unit tests
├── infrastructure/
│   └── docker/
│       ├── Dockerfile             # Container image definition
│       └── docker-compose.yml     # Multi-container orchestration
├── docs/
│   ├── api-documentation.md       # REST API reference
│   ├── design-document.md         # Architecture & design
│   ├── project-plan.md            # Project roadmap
│   ├── user-guide.md              # Usage instructions
│   └── architecture.md            # System architecture
├── pipelines/
│   └── ci-cd.yml                  # CI/CD pipeline config
├── monitoring/
│   ├── health-check.sh            # Health check script
│   └── prometheus.yml             # Monitoring config
├── .github/
│   └── workflows/
│       └── ci-cd.yml              # GitHub Actions workflow
├── requirements.txt               # Python dependencies
├── Makefile                       # Development commands
└── .env.example                   # Environment variables template
```

## Installation

### Prerequisites

- Python 3.11+
- pip or conda
- Docker & Docker Compose (optional, for containerized deployment)
- Git

### Local Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd api-test-generator
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the application:
```bash
python src/main/app.py
```

The API will be available at `http://localhost:8080`

### Verify Installation

```bash
# Check health endpoint
curl http://localhost:8080/health

# Expected response:
# {"status": "healthy", "service": "API Test Generator"}
```

## Docker Usage

### Quick Start with Docker Compose

The easiest way to run the entire stack:

```bash
# Start all services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

### Using Makefile Commands

```bash
# Build Docker image
make docker-build

# Run container
make docker-run

# Stop container
make docker-stop

# View logs
make docker-logs

# Clean up
make docker-clean
```

### Manual Docker Commands

```bash
# Build image
docker build -t api-test-generator:latest -f infrastructure/docker/Dockerfile .

# Run container with port mapping
docker run -d \
  --name api-test-generator \
  -p 8080:8080 \
  -e FLASK_ENV=production \
  -v $(pwd)/generated_tests:/app/generated_tests \
  api-test-generator:latest

# Access the API
curl http://localhost:8080/health

# Stop container
docker stop api-test-generator
docker rm api-test-generator
```

### Docker Configuration

The Docker setup includes:
- **Non-root user** for security
- **Health checks** for container monitoring
- **Volume mounts** for persistent test generation
- **Environment variables** for configuration
- **Logging** for debugging and monitoring

See `infrastructure/docker/Dockerfile` and `infrastructure/docker/docker-compose.yml` for detailed configuration.

## API Endpoints

### Health Check
```
GET /health
```
Returns service health status.

### Generate Tests
```
POST /generate-tests
```
Generates pytest test code from OpenAPI/Swagger specification.

**Request (File Upload):**
```bash
curl -X POST \
  -F "file=@swagger.json" \
  http://localhost:8080/generate-tests
```

**Request (JSON Body):**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d @swagger.json \
  http://localhost:8080/generate-tests
```

**Response:**
```json
{
  "status": "success",
  "test_code": "import pytest\nimport requests\n...",
  "endpoints_count": 5
}
```

### Parse Specification
```
POST /parse
```
Parses OpenAPI/Swagger spec and returns extracted endpoints.

**Response:**
```json
{
  "status": "success",
  "endpoints": [
    {"method": "GET", "path": "/api/users"},
    {"method": "POST", "path": "/api/users"}
  ],
  "count": 2
}
```

## CI/CD Pipeline

The GitHub Actions CI/CD pipeline automates testing, linting, and deployment:

### Pipeline Stages

1. **Install Dependencies** (Stage 1)
   - Sets up Python 3.11 environment
   - Installs all dependencies from requirements.txt
   - Caches pip packages for faster builds
   - Verifies all packages are installed correctly

2. **Lint Checks** (Stage 2)
   - Runs flake8 for code style validation
   - Checks code formatting with black
   - Validates import sorting with isort
   - Runs pylint for code quality analysis

3. **Run Tests** (Stage 3)
   - Executes pytest test suite
   - Generates coverage reports
   - Uploads coverage to Codecov
   - Validates test results

4. **Build Docker Image** (Stage 4)
   - Sets up Docker Buildx for multi-platform builds
   - Builds Docker image with caching
   - Extracts metadata for tagging
   - Validates image build success

5. **Push Docker Artifact** (Stage 5)
   - Pushes image to GitHub Container Registry
   - Only runs on main/develop branches
   - Tags with branch, version, and SHA
   - Logs in with GitHub token

### Pipeline Triggers

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual workflow dispatch

### Viewing Pipeline Status

1. Go to GitHub repository
2. Click "Actions" tab
3. Select workflow run to view details
4. Check individual job logs for debugging

### Local Testing Before Push

```bash
# Run linting
flake8 src/ tests/ --max-line-length=120

# Check formatting
black --check src/ tests/

# Run tests
pytest tests/ -v --cov=src

# Build Docker image locally
docker build -t api-test-generator:test -f infrastructure/docker/Dockerfile .
```

## Usage Examples

### Generate Tests from Swagger File

```bash
# Using curl with file upload
curl -X POST \
  -F "file=@path/to/swagger.json" \
  http://localhost:8080/generate-tests \
  > generated_tests.py

# Using Python requests
import requests

with open('swagger.json', 'rb') as f:
    files = {'file': f}
    response = requests.post(
        'http://localhost:8080/generate-tests',
        files=files
    )
    
print(response.json()['test_code'])
```

### Parse Endpoints from Specification

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d @swagger.json \
  http://localhost:8080/parse
```

### Run Generated Tests

```bash
# Generate tests
curl -X POST -F "file=@swagger.json" \
  http://localhost:8080/generate-tests \
  | jq -r '.test_code' > my_tests.py

# Run with pytest
pytest my_tests.py -v
```

## Development

### Running Tests Locally

```bash
# Install test dependencies
pip install -r requirements.txt

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=src --cov-report=html

# Run specific test file
pytest tests/test_app.py -v

# Run specific test
pytest tests/test_app.py::test_health_check -v
```

### Code Quality Checks

```bash
# Format code with black
black src/ tests/

# Sort imports with isort
isort src/ tests/

# Check with flake8
flake8 src/ tests/ --max-line-length=120

# Run pylint
pylint src/main/*.py
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Flask configuration
FLASK_ENV=development
PORT=8080
HOST=0.0.0.0

# Upload configuration
UPLOAD_FOLDER=/tmp

# Docker configuration
DOCKER_REGISTRY=ghcr.io
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t api-test-generator:latest .
```

### Tests Failing

```bash
# Run tests with verbose output
pytest tests/ -vv --tb=long

# Run specific test with debugging
pytest tests/test_app.py::test_generate_tests -vv -s
```

### Import Errors

```bash
# Verify virtual environment is activated
which python

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

## Documentation

For detailed information, see:

- **[API Documentation](docs/api-documentation.md)** - Complete REST API reference
- **[User Guide](docs/user-guide.md)** - Step-by-step usage instructions
- **[Design Document](docs/design-document.md)** - Architecture and design patterns
- **[Project Plan](docs/project-plan.md)** - Project roadmap and timeline
- **[Architecture](docs/architecture.md)** - System architecture overview

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit a pull request

All pull requests must:
- Pass linting checks
- Include tests for new functionality
- Update documentation as needed
- Pass CI/CD pipeline

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues, questions, or suggestions:
1. Check existing documentation in `docs/`
2. Review troubleshooting section above
3. Open an issue on GitHub
4. Contact the development team

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pip install -r requirements.txt` |
| Run app locally | `python src/main/app.py` |
| Run tests | `pytest tests/ -v` |
| Run with Docker | `docker-compose -f infrastructure/docker/docker-compose.yml up` |
| Format code | `black src/ tests/` |
| Check linting | `flake8 src/ tests/` |
| Generate coverage | `pytest tests/ --cov=src --cov-report=html` |
| View API docs | Open `docs/api-documentation.md` |
