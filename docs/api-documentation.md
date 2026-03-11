# API Documentation

## Overview

The API Test Generator provides a REST API for automatically generating pytest test cases from OpenAPI/Swagger specifications.

## Base URL

```
http://localhost:8080
```

## Endpoints

### GET /health

**Description:** Health check endpoint

**Request:**
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

**Status Code:** 200 OK

---

### POST /generate-tests

**Description:** Generate pytest test cases from OpenAPI/Swagger specification

#### File Upload

```bash
curl -X POST -F "file=@openapi.json" \
  http://localhost:8080/generate-tests
```

#### JSON Body

```bash
curl -X POST -H "Content-Type: application/json" \
  -d @openapi.json \
  http://localhost:8080/generate-tests
```

**Response (Success):**
```json
{
  "status": "success",
  "test_code": "import pytest\nimport requests\n...",
  "endpoints_count": 6
}
```

**Response (Error):**
```json
{
  "error": "File must be JSON or YAML"
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request
- 500: Server Error

---

### POST /parse

**Description:** Parse OpenAPI/Swagger specification and extract endpoints

**Request:**
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

**Status Code:** 200 OK

---

## Supported Formats

- OpenAPI 3.0
- Swagger 2.0
- JSON (.json)
- YAML (.yaml, .yml)

---

## Error Codes

| Code | Message |
|------|---------|
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

---

## Examples

### Generate Tests
```bash
curl -X POST -F "file=@openapi.json" \
  http://localhost:8080/generate-tests \
  -o generated_tests.py
```

### Parse Endpoints
```bash
curl -X POST -H "Content-Type: application/json" \
  -d @openapi.json \
  http://localhost:8080/parse
```

---

## Support

For issues: GitHub Issues
For questions: GitHub Discussions
