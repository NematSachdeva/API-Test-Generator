# API Test Generator - Design Document

## Document Information

- **Title:** API Test Generator - System Design
- **Version:** 1.0
- **Date:** 2026-03-09
- **Status:** Complete

## 1. System Overview

### 1.1 Purpose
The API Test Generator automatically generates pytest test cases from OpenAPI/Swagger specifications, eliminating manual test creation and ensuring comprehensive API endpoint coverage.

### 1.2 Scope
- Parse OpenAPI 3.0 and Swagger 2.0 specifications
- Extract endpoint information (paths, methods, parameters)
- Generate pytest test cases with status code validation
- Provide REST API for integration
- Support Docker containerization
- Integrate with GitHub Actions CI/CD

### 1.3 Key Features
- Automatic test generation from API specs
- Support for multiple specification formats
- REST API for programmatic access
- File upload and JSON body support
- Docker containerization
- GitHub Actions CI/CD integration
- Comprehensive error handling
- Health check endpoints

## 2. Architecture

### 2.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Web UI     │  │   CLI Tool   │  │   API Call   │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    API Layer (Flask)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ /health      │  │ /generate    │  │ /parse       │       │
│  │              │  │ -tests       │  │              │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Business Logic Layer                        │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │   Parser     │  │  Generator   │                         │
│  │              │  │              │                         │
│  │ - OpenAPI    │  │ - pytest     │                         │
│  │ - Swagger    │  │ - fixtures   │                         │
│  │ - YAML/JSON  │  │ - assertions │                         │
│  └──────────────┘  └──────────────┘                         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Data Layer                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ File System  │  │   Memory     │  │   Volumes    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

#### Parser Component
```
SwaggerParser
├── __init__(spec)
├── get_endpoints()
├── _extract_parameters()
├── _extract_request_body()
├── _extract_responses()
├── get_base_url()
├── get_api_title()
├── get_api_version()
├── load_from_file()
└── load_from_string()
```

**Responsibilities:**
- Parse OpenAPI/Swagger specifications
- Extract endpoint information
- Handle YAML and JSON formats
- Provide metadata extraction

#### Generator Component
```
TestGenerator
├── __init__(parser)
├── generate()
├── _generate_header()
├── _generate_fixtures()
├── _generate_test_cases()
├── _generate_single_test()
├── _generate_test_name()
├── generate_test_file()
└── get_test_summary()
```

**Responsibilities:**
- Generate pytest test code
- Create test fixtures
- Generate test functions
- Handle test naming
- Provide generation summary

#### Flask API Component
```
Flask Application
├── /health (GET)
├── /generate-tests (POST)
├── /parse (POST)
├── Error handlers
└── Configuration
```

**Responsibilities:**
- Handle HTTP requests
- Manage file uploads
- Process JSON bodies
- Return responses
- Handle errors

### 2.3 Data Flow

```
User Input (File or JSON)
    │
    ▼
Flask Endpoint
    │
    ├─► File Upload Handler
    │   └─► Save to temp
    │
    └─► JSON Body Handler
        │
        ▼
    SwaggerParser.load_from_file() or request.json
        │
        ▼
    SwaggerParser.get_endpoints()
        │
        ├─► Extract paths
        ├─► Extract methods
        ├─► Extract parameters
        └─► Extract metadata
        │
        ▼
    TestGenerator.generate()
        │
        ├─► Generate header
        ├─► Generate fixtures
        └─► Generate test cases
        │
        ▼
    Generated pytest code
        │
        ▼
    JSON Response
        │
        ▼
    User receives test code
```

## 3. Design Patterns

### 3.1 Patterns Used

**Factory Pattern:**
- SwaggerParser creates endpoint objects
- TestGenerator creates test functions

**Builder Pattern:**
- TestGenerator builds test code step by step
- Fixtures and test cases built separately

**Strategy Pattern:**
- Different parsing strategies for OpenAPI vs Swagger
- Different test generation strategies

**Singleton Pattern:**
- Flask application instance
- Configuration management

### 3.2 Design Principles

**SOLID Principles:**
- **S**ingle Responsibility: Each class has one job
- **O**pen/Closed: Open for extension, closed for modification
- **L**iskov Substitution: Subtypes can replace base types
- **I**nterface Segregation: Specific interfaces
- **D**ependency Inversion: Depend on abstractions

**DRY (Don't Repeat Yourself):**
- Reusable fixtures
- Common test structure
- Shared utilities

**KISS (Keep It Simple, Stupid):**
- Simple, readable code
- Clear naming conventions
- Minimal complexity

## 4. API Design

### 4.1 REST Endpoints

#### GET /health
```
Request:
  GET /health

Response:
  200 OK
  {
    "status": "healthy",
    "service": "API Test Generator"
  }
```

#### POST /generate-tests
```
Request (File Upload):
  POST /generate-tests
  Content-Type: multipart/form-data
  file: <OpenAPI spec file>

Request (JSON Body):
  POST /generate-tests
  Content-Type: application/json
  {OpenAPI spec JSON}

Response:
  200 OK
  {
    "status": "success",
    "test_code": "import pytest\n...",
    "endpoints_count": 6
  }

Error Response:
  400 Bad Request
  {
    "error": "File must be JSON or YAML"
  }
```

#### POST /parse
```
Request:
  POST /parse
  Content-Type: application/json
  {OpenAPI spec JSON}

Response:
  200 OK
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

### 4.2 Error Handling

**Error Codes:**
- 400: Bad Request (invalid input)
- 404: Not Found (endpoint not found)
- 500: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error description"
}
```

## 5. Database Design

### 5.1 Data Storage

**Current Implementation:**
- No persistent database
- In-memory processing
- Temporary file storage

**Future Enhancement:**
- PostgreSQL for test history
- Redis for caching
- S3 for artifact storage

### 5.2 File Structure

```
/app
├── src/
│   ├── main/
│   │   ├── app.py
│   │   ├── parser.py
│   │   └── test_generator.py
│   ├── scripts/
│   │   └── generate_tests.py
│   └── test/
│       └── __init__.py
├── tests/
│   ├── test_app.py
│   └── test_swagger_parser.py
├── generated_tests/
│   └── (generated test files)
└── uploads/
    └── (uploaded spec files)
```

## 6. Security Design

### 6.1 Security Measures

**Input Validation:**
- File extension validation
- File size limits (16MB)
- JSON schema validation
- Secure filename handling

**Access Control:**
- Non-root user in Docker
- Read-only filesystem support
- Resource limits
- Network isolation

**Data Protection:**
- No sensitive data logging
- Temporary file cleanup
- Secure error messages

### 6.2 Security Best Practices

- Use environment variables for configuration
- Validate all user input
- Sanitize error messages
- Use HTTPS in production
- Implement rate limiting (future)
- Add authentication (future)

## 7. Performance Design

### 7.1 Performance Considerations

**Optimization Strategies:**
- Layer caching in Docker
- Pip package caching in CI/CD
- Efficient parsing algorithms
- Minimal memory footprint

**Scalability:**
- Stateless API design
- Horizontal scaling support
- Load balancing ready
- Containerized deployment

### 7.2 Performance Metrics

**Expected Performance:**
- Parse spec: < 100ms
- Generate tests: < 500ms
- Total request: < 1 second
- Memory usage: < 100MB

## 8. Testing Strategy

### 8.1 Test Types

**Unit Tests:**
- Parser functionality
- Generator functionality
- API endpoints

**Integration Tests:**
- End-to-end workflows
- File upload handling
- JSON body processing

**System Tests:**
- Docker container
- CI/CD pipeline
- Health checks

### 8.2 Test Coverage

**Target Coverage:**
- Code coverage: 90%+
- Endpoint coverage: 100%
- Error handling: 100%

## 9. Deployment Design

### 9.1 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         GitHub Repository               │
│  ┌─────────────────────────────────┐   │
│  │   Push to main/develop          │   │
│  └──────────────┬──────────────────┘   │
└─────────────────┼──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│      GitHub Actions CI/CD              │
│  ┌─────────────────────────────────┐   │
│  │ 1. Install dependencies         │   │
│  │ 2. Run lint checks              │   │
│  │ 3. Run tests                    │   │
│  │ 4. Build Docker image           │   │
│  │ 5. Push to registry             │   │
│  └──────────────┬──────────────────┘   │
└─────────────────┼──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│   GitHub Container Registry            │
│  ┌─────────────────────────────────┐   │
│  │ ghcr.io/username/repo:latest    │   │
│  └──────────────┬──────────────────┘   │
└─────────────────┼──────────────────────┘
                  │
┌─────────────────▼──────────────────────┐
│      Docker Container                  │
│  ┌─────────────────────────────────┐   │
│  │ Python 3.11 slim                │   │
│  │ Port 8080                       │   │
│  │ Health checks                   │   │
│  │ Logging                         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 9.2 Deployment Steps

1. **Local Development**
   - Clone repository
   - Install dependencies
   - Run tests
   - Test locally

2. **Push to Repository**
   - Commit changes
   - Push to main/develop
   - CI/CD pipeline runs

3. **Automated Testing**
   - Install dependencies
   - Run lint checks
   - Run tests
   - Build Docker image

4. **Docker Registry**
   - Push image to ghcr.io
   - Tag with version
   - Tag with latest

5. **Production Deployment**
   - Pull image from registry
   - Run Docker container
   - Configure environment
   - Start service

## 10. Monitoring & Logging

### 10.1 Monitoring

**Health Checks:**
- Endpoint: GET /health
- Interval: 30 seconds
- Timeout: 10 seconds
- Retries: 3

**Metrics:**
- Request count
- Response time
- Error rate
- CPU usage
- Memory usage

### 10.2 Logging

**Log Levels:**
- DEBUG: Detailed information
- INFO: General information
- WARNING: Warning messages
- ERROR: Error messages
- CRITICAL: Critical errors

**Log Format:**
```
[TIMESTAMP] [LEVEL] [MODULE] Message
```

## 11. Maintenance & Support

### 11.1 Maintenance Plan

**Regular Tasks:**
- Monitor GitHub Actions
- Update dependencies
- Review and fix issues
- Update documentation

**Frequency:**
- Daily: Monitor CI/CD
- Weekly: Review issues
- Monthly: Update dependencies
- Quarterly: Major updates

### 11.2 Support

**Support Channels:**
- GitHub Issues
- GitHub Discussions
- Email support
- Documentation

## 12. Future Enhancements

### 12.1 Phase 2 Features

- GraphQL API support
- Advanced authentication
- Request body generation
- Response validation
- Test execution and reporting

### 12.2 Phase 3 Features

- Web UI
- Test scheduling
- Performance testing
- Load testing
- Integration with CI/CD platforms

## 13. Conclusion

The API Test Generator is designed with scalability, security, and maintainability in mind. The modular architecture allows for easy extension and modification. The comprehensive testing and documentation ensure reliability and ease of use.

## Appendix A: Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Language | Python | 3.11 |
| Web Framework | Flask | 3.0.0 |
| Testing | pytest | 7.4.3 |
| YAML Parsing | PyYAML | 6.0.1 |
| HTTP Client | requests | 2.31.0 |
| Containerization | Docker | 20.10+ |
| CI/CD | GitHub Actions | Latest |
| Registry | GitHub Container Registry | Latest |

## Appendix B: References

- [OpenAPI Specification](https://spec.openapis.org/)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [pytest Documentation](https://docs.pytest.org/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
