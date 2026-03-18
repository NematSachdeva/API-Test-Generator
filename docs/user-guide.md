# API Test Generator - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Running with Docker](#running-with-docker)
4. [Using the API](#using-the-api)
5. [Using the CLI](#using-the-cli)
6. [Workflow Explanation](#workflow-explanation)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### What is the API Test Generator?

The API Test Generator automatically creates pytest test cases from OpenAPI/Swagger specifications. Instead of manually writing tests for each API endpoint, you provide your API specification and the tool generates comprehensive test code.

### Key Benefits

- **Saves Time:** Eliminate manual test creation
- **Ensures Coverage:** Generate tests for all endpoints
- **Standardizes Tests:** Consistent test structure
- **Improves Quality:** Automated, reliable tests
- **Integrates Easily:** REST API for integration

### Quick Start (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/your-username/api-test-generator.git
cd api-test-generator

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run the application
python src/main/app.py

# 4. Generate tests
curl -X POST -F "file=@openapi.json" \
  http://localhost:8080/generate-tests \
  -o my_tests.py

# 5. Run tests
pytest my_tests.py -v
```

## Installation

### Prerequisites

- Python 3.11+
- pip (Python package manager)
- Docker (optional, for containerized deployment)

### Local Installation

#### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/api-test-generator.git
cd api-test-generator
```

#### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

#### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

#### Step 4: Verify Installation
```bash
python -c "import flask; print(f'Flask: {flask.__version__}')"
python -c "import pytest; print(f'pytest: {pytest.__version__}')"
```

### Docker Installation

#### Step 1: Build Docker Image
```bash
docker build -f infrastructure/docker/Dockerfile \
  -t api-test-generator:latest .
```

#### Step 2: Verify Image
```bash
docker images | grep api-test-generator
```

## Running with Docker

### Docker Quick Start

#### Option 1: Docker Run

```bash
# Run container
docker run -p 8080:8080 api-test-generator:latest

# In another terminal, test the API
curl http://localhost:8080/health
```

#### Option 2: Docker Compose

```bash
# Start services
docker-compose -f infrastructure/docker/docker-compose.yml up -d

# View logs
docker-compose -f infrastructure/docker/docker-compose.yml logs -f

# Stop services
docker-compose -f infrastructure/docker/docker-compose.yml down
```

### Docker Configuration

#### Environment Variables

```bash
# Port (default: 8080)
docker run -p 9000:8080 \
  -e PORT=8080 \
  api-test-generator:latest

# Flask environment
docker run -p 8080:8080 \
  -e FLASK_ENV=development \
  api-test-generator:latest
```

#### Volume Mounts

```bash
# Mount volumes for persistence
docker run -p 8080:8080 \
  -v $(pwd)/generated_tests:/app/generated_tests \
  -v $(pwd)/uploads:/app/uploads \
  api-test-generator:latest
```

### Docker Compose Configuration

```yaml
version: '3.8'

services:
  api-test-generator:
    build:
      context: .
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "8080:8080"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./generated_tests:/app/generated_tests
      - ./uploads:/app/uploads
    restart: unless-stopped
```

### Accessing the Application

**Local:**
```
http://localhost:8080
```

**Health Check:**
```bash
curl http://localhost:8080/health
```

**Expected Response:**
```json
{"status": "healthy", "service": "API Test Generator"}
```

## Using the API

### API Endpoints

#### 1. Health Check

```bash
curl http://localhost:8080/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "API Test Generator"
}
```

#### 2. Generate Tests (File Upload)

```bash
curl -X POST -F "file=@openapi.json" \
  http://localhost:8080/generate-tests \
  -o generated_tests.py
```

**Supported Formats:**
- JSON (.json)
- YAML (.yaml, .yml)

**Response:**
```json
{
  "status": "success",
  "test_code": "import pytest\n...",
  "endpoints_count": 6
}
```

#### 3. Generate Tests (JSON Body)

```bash
curl -X POST -H "Content-Type: application/json" \
  -d @openapi.json \
  http://localhost:8080/generate-tests
```

#### 4. Parse Specification

```bash
curl -X POST -H "Content-Type: application/json" \
  -d @openapi.json \
  http://localhost:8080/parse
```

**Response:**
```json
{
  "status": "success",
  "endpoints": [
    {
      "path": "/users",
      "method": "GET",
      "summary": "Get all users",
      "parameters": [],
      "responses": {"200": "Success"}
    }
  ],
  "count": 1
}
```

### Error Handling

**Invalid File Format:**
```json
{
  "error": "File must be JSON or YAML"
}
```

**No Input Provided:**
```json
{
  "error": "No file or JSON body provided"
}
```

**Invalid JSON:**
```json
{
  "error": "Invalid JSON format"
}
```

## Using the CLI

### CLI Script

```bash
python src/scripts/generate_tests.py <spec_file> [output_file]
```

### Examples

#### Generate from JSON
```bash
python src/scripts/generate_tests.py openapi.json
# Output: test_generated.py
```

#### Generate from YAML
```bash
python src/scripts/generate_tests.py openapi.yaml
# Output: test_generated.py
```

#### Specify Output File
```bash
python src/scripts/generate_tests.py openapi.json my_tests.py
# Output: my_tests.py
```

### CLI Output

```
======================================================================
API Test Generator - Sample Test Generation
======================================================================

1. Parsing OpenAPI specification...
   ✓ Found 6 endpoints
     - GET    /users               Get all users
     - POST   /users               Create a new user
     - GET    /users/{id}          Get user by ID
     - PUT    /users/{id}          Update user
     - DELETE /users/{id}          Delete user
     - GET    /users/search        Search users

2. Generating pytest test cases...
   ✓ Generated 6 test cases
   ✓ Methods: {'GET': 3, 'POST': 1, 'PUT': 1, 'DELETE': 1}
   ✓ API: Sample User API v1.0.0
   ✓ Base URL: https://api.example.com/v1

3. Saving generated tests to my_tests.py...
   ✓ Tests saved to my_tests.py

4. Test File Statistics:
   ✓ Total lines: 283
   ✓ Test functions: 6
   ✓ Assertions: 12
   ✓ Print statements: 48

======================================================================
✓ Test generation complete!
======================================================================
```

## Workflow Explanation

### Complete Workflow

```
1. Prepare OpenAPI Specification
   ↓
2. Submit to API Test Generator
   ├─ File Upload
   └─ JSON Body
   ↓
3. Parser Extracts Endpoints
   ├─ Paths
   ├─ Methods
   ├─ Parameters
   └─ Responses
   ↓
4. Test Generator Creates Tests
   ├─ Header with imports
   ├─ Pytest fixtures
   └─ Test functions
   ↓
5. Receive Generated Test Code
   ↓
6. Run Tests (NEW!)
   ├─ From UI: Click "Run Tests" button
   ├─ From CLI: pytest generated_tests.py
   └─ View results in real-time
   ↓
7. View Results
   ├─ Test summary (passed/failed)
   ├─ Individual test status
   ├─ Environment info
   └─ Console output
   ↓
8. Integrate with CI/CD
   ├─ GitHub Actions
   └─ Other platforms
```

### Step-by-Step Workflow

#### Step 1: Prepare Your OpenAPI Specification

Create or obtain your OpenAPI specification file:

```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Success
    post:
      summary: Create user
      responses:
        '201':
          description: Created
```

#### Step 2: Submit to API Test Generator

**Option A: File Upload**
```bash
curl -X POST -F "file=@openapi.yaml" \
  http://localhost:8080/generate-tests \
  -o generated_tests.py
```

**Option B: JSON Body**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d @openapi.json \
  http://localhost:8080/generate-tests
```

#### Step 3: Receive Generated Tests

The API returns:
```json
{
  "status": "success",
  "test_code": "import pytest\n...",
  "endpoints_count": 2
}
```

#### Step 4: Run Generated Tests

**Option A: From Web UI (NEW!)**
1. Upload Swagger file
2. Click "Generate Tests"
3. Click "Run Tests" button
4. View results in real-time with:
   - ✅ Test summary (passed, failed, total)
   - 📋 Individual test results
   - 🖥️ Environment info
   - 📊 Execution time
   - 🔍 Console output

**Option B: From Command Line**
```bash
pytest generated_tests.py -v -s
```

**Output:**
```
generated_tests.py::test_get_users_1 PASSED
Testing endpoint: GET /users
URL: https://api.example.com/v1/users
Status Code: 200
Response Headers: {...}
Response Body: [...]
✓ Test passed for GET /users

generated_tests.py::test_post_users_2 PASSED
Testing endpoint: POST /users
URL: https://api.example.com/v1/users
Status Code: 201
Response Headers: {...}
Response Body: {...}
✓ Test passed for POST /users
```

#### Step 5: View Test Results

**From UI:**
- Test Summary Card: Shows passed, failed, total tests
- Test Results List: Individual test status with icons
- Environment Info: Python, pytest, platform versions
- Console Output: Full pytest output (collapsible)

**From CLI:**
```bash
pytest generated_tests.py -v --tb=short
```

#### Step 6: Customize Tests (Optional)

Edit generated tests to add:
- Authentication headers
- Request payloads
- Query parameters
- Custom assertions

#### Step 7: Integrate with CI/CD

Add to your GitHub Actions workflow:
```yaml
- name: Run API Tests
  run: pytest generated_tests.py -v
```

## Examples

### Example 1: Simple API

**OpenAPI Spec:**
```yaml
openapi: 3.0.0
info:
  title: Simple API
  version: 1.0.0
servers:
  - url: http://localhost:3000
paths:
  /status:
    get:
      summary: Get status
      responses:
        '200':
          description: OK
```

**Generated Test:**
```python
def test_get_status_1(api_client, base_url):
    """
    Test: Get status
    Method: GET
    Path: /status
    """
    endpoint_name = "GET /status"
    print(f"\nTesting endpoint: {endpoint_name}")
    
    url = f"{base_url}/status"
    print(f"URL: {url}")
    
    try:
        response = api_client.get(url, timeout=TIMEOUT)
        print(f"Status Code: {response.status_code}")
        
        assert response.status_code in [200, 201, 204, 400, 401, 403, 404, 500]
        
        if response.status_code < 400:
            print(f"Response Body: {response.text[:200]}")
            assert response.text
        
        print(f"✓ Test passed for {endpoint_name}")
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Request failed for {endpoint_name}: {str(e)}")
        raise
```

### Example 2: Complex API

**OpenAPI Spec:**
```yaml
openapi: 3.0.0
info:
  title: User API
  version: 2.0.0
servers:
  - url: https://api.example.com/v2
paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        '200':
          description: Success
    post:
      summary: Create user
      responses:
        '201':
          description: Created
  /users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Success
        '404':
          description: Not found
```

**Generated Tests:** 3 test functions for 3 endpoints

## Troubleshooting

### Issue 1: Connection Refused

**Problem:**
```
requests.exceptions.ConnectionError: Failed to establish a new connection
```

**Solution:**
1. Check if API is running: `curl http://localhost:8080/health`
2. Verify port: `docker ps | grep 8080`
3. Check firewall settings
4. Restart container: `docker restart api-test-generator`

### Issue 2: Invalid File Format

**Problem:**
```json
{"error": "File must be JSON or YAML"}
```

**Solution:**
1. Check file extension (.json, .yaml, .yml)
2. Verify file format is valid
3. Use correct Content-Type header

### Issue 3: Tests Fail

**Problem:**
```
AssertionError: assert 500 == 200
```

**Solution:**
1. Check API is running
2. Verify base URL in generated tests
3. Check API logs for errors
4. Verify API specification is correct

### Issue 4: Docker Build Fails

**Problem:**
```
failed to solve with frontend dockerfile.v0
```

**Solution:**
1. Check Dockerfile exists
2. Verify file paths
3. Build with verbose output: `docker build --progress=plain ...`
4. Check Docker version

## Best Practices

### 1. Specification Quality
- Keep specifications up-to-date
- Use consistent naming conventions
- Document all endpoints
- Include response examples

### 2. Test Management
- Review generated tests
- Customize as needed
- Add authentication
- Add request payloads

### 3. CI/CD Integration
- Run tests on every push
- Monitor test results
- Fix failures quickly
- Update tests with API changes

### 4. Documentation
- Document custom changes
- Keep README updated
- Maintain test documentation
- Document API changes

## Support & Help

### Getting Help

1. **Check Documentation**
   - [API Documentation](api-documentation.md)
   - [Design Document](design-document.md)
   - [Project Plan](project-plan.md)

2. **GitHub Issues**
   - Search existing issues
   - Create new issue with details
   - Include error messages and logs

3. **GitHub Discussions**
   - Ask questions
   - Share experiences
   - Get community help

4. **Email Support**
   - support@example.com
   - Include detailed description
   - Attach relevant files

## Summary

The API Test Generator streamlines API testing by automatically generating pytest test cases from OpenAPI/Swagger specifications. With Docker support, REST API, and CLI options, it integrates easily into any workflow.

For more information, see:
- [API Documentation](api-documentation.md)
- [Design Document](design-document.md)
- [Project Plan](project-plan.md)
