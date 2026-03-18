# API Test Generator - Demo Script

## Demo Overview

This script guides you through a complete demonstration of the API Test Generator, showcasing all key features including the new "Run Tests" functionality.

**Duration:** 10-15 minutes  
**Audience:** Developers, DevOps Engineers, QA Teams  
**Prerequisites:** Application running on http://localhost:8080

---

## Pre-Demo Checklist

- [ ] Application running: `python src/main/app.py`
- [ ] Browser open to http://localhost:8080
- [ ] Sample Swagger file ready: `docs/eg Swagger/OpenAPI files/jsonplaceholder_api.yaml`
- [ ] Terminal ready for CLI examples
- [ ] Docker running (for Docker demo)

---

## Demo Flow

### 1. Introduction (1 minute)

**What to say:**
> "Today I'm going to show you the API Test Generator - a tool that automatically creates pytest test cases from your OpenAPI or Swagger specifications. This saves hours of manual test writing and ensures consistent test coverage across all your API endpoints."

**Key Points:**
- Automates test generation from API specs
- Supports OpenAPI 3.0 and Swagger 2.0
- Includes a modern web UI
- Runs tests directly from the browser
- Integrates with CI/CD pipelines

---

### 2. Web UI Overview (2 minutes)

**Action:** Open http://localhost:8080 in browser

**What to show:**
1. **Header Section**
   - Logo and title
   - Tagline: "Generate pytest tests from OpenAPI/Swagger specifications"

2. **Upload Section**
   - Drag-and-drop area
   - File format support (JSON, YAML)
   - "Generate Tests" button

3. **How It Works Section**
   - 3-step process visualization
   - Upload → Parse → Generate

**What to say:**
> "The interface is clean and intuitive. You can drag and drop your Swagger file here, or click to browse. The tool supports both JSON and YAML formats."

---

### 3. Generate Tests Demo (3 minutes)

**Action:** Upload a sample Swagger file

**Steps:**
1. Click on upload area
2. Select `docs/eg Swagger/OpenAPI files/jsonplaceholder_api.yaml`
3. Click "Generate Tests"
4. Wait for processing

**What to show:**
- Loading spinner
- Status message: "Parsing API specification..."
- Generated test code appears
- Endpoint count displayed
- Code viewer with line numbers

**What to say:**
> "Notice how quickly the tests are generated. The tool parsed the Swagger file, extracted all endpoints, and created pytest test cases. You can see the endpoint count here, and the generated code is displayed with line numbers for easy reference."

**Features to highlight:**
- Copy button (copy to clipboard)
- Download button (save as file)
- Run Tests button (NEW!)
- View Code button (after running tests)

---

### 4. Run Tests Feature Demo (4 minutes) - NEW!

**Action:** Click "Run Tests" button

**What happens:**
1. Button shows loading spinner
2. Status message: "Running tests..."
3. Backend executes pytest
4. Results display in real-time

**What to show:**
1. **Test Summary Card**
   - Tests Passed (green)
   - Tests Failed (red)
   - Total Tests
   - Endpoints Tested
   - Execution Time

2. **Test Results List**
   - Individual test names
   - Status badges (✓ PASSED, ✗ FAILED)
   - Color-coded results

3. **Environment Info**
   - Python version
   - Pytest version
   - Platform

4. **Console Output**
   - Collapsible section
   - Full pytest output
   - Detailed test information

**What to say:**
> "This is the new Run Tests feature! Instead of downloading the tests and running them manually, you can now execute them directly from the UI. The backend runs pytest dynamically and displays the results in real-time. You can see the test summary, individual test results, and the full console output."

**Highlight:**
- Real-time execution
- Professional result visualization
- Easy debugging with console output
- No need to leave the browser

---

### 5. Copy & Download Demo (1 minute)

**Action:** Show Copy and Download buttons

**What to say:**
> "You can easily copy the generated code to your clipboard or download it as a Python file. This makes it simple to integrate the tests into your project."

**Steps:**
1. Click "Copy" button
2. Show confirmation message
3. Click "Download" button
4. Show file download

---

### 6. API Endpoint Demo (2 minutes)

**Action:** Show REST API usage in terminal

**Command 1: Generate Tests via API**
```bash
curl -X POST -F "file=@docs/eg\ Swagger/OpenAPI\ files/jsonplaceholder_api.yaml" \
  http://localhost:8080/generate-tests \
  -o generated_tests.py
```

**What to say:**
> "The tool also provides a REST API for programmatic access. You can send your Swagger file to the /generate-tests endpoint and get back the generated test code."

**Command 2: Parse Endpoints**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d @docs/eg\ Swagger/OpenAPI\ files/demo_api.json \
  http://localhost:8080/parse | jq .
```

**What to show:**
- Extracted endpoints
- Methods (GET, POST, PUT, DELETE)
- Endpoint paths
- Response codes

---

### 7. Docker Demo (2 minutes) - Optional

**Action:** Show Docker deployment

**What to say:**
> "The application is containerized with Docker, making it easy to deploy anywhere. You can run it locally, in the cloud, or in Kubernetes."

**Commands:**
```bash
# Build Docker image
make docker-build

# Run container
make docker-run

# View logs
make docker-logs

# Stop container
make docker-stop
```

**What to show:**
- Docker image building
- Container running
- Health check passing
- Application accessible on port 8080

---

### 8. CI/CD Integration Demo (1 minute) - Optional

**What to say:**
> "The project includes a complete CI/CD pipeline using GitHub Actions. Every push triggers automated testing, linting, Docker image building, and deployment."

**Show:**
- `.github/workflows/ci-cd.yml` file
- Pipeline stages:
  1. Install Dependencies
  2. Lint Checks
  3. Run Tests
  4. Build Docker Image
  5. Push Docker Artifact

---

### 9. Q&A and Closing (1 minute)

**Key Takeaways:**
1. ✅ Automates test generation from API specs
2. ✅ Modern web UI with real-time test execution
3. ✅ REST API for programmatic access
4. ✅ Docker containerization
5. ✅ CI/CD integration
6. ✅ Saves time and ensures consistency

**Call to Action:**
> "Try it out! Upload your own Swagger file and generate tests. The tool supports any OpenAPI 3.0 or Swagger 2.0 specification."

---

## Demo Tips

### Best Practices

1. **Preparation**
   - Test everything before the demo
   - Have sample files ready
   - Know the keyboard shortcuts
   - Have a backup plan if something fails

2. **Presentation**
   - Speak clearly and slowly
   - Pause for questions
   - Highlight key features
   - Show real-world use cases

3. **Engagement**
   - Ask questions to the audience
   - Encourage hands-on exploration
   - Show practical examples
   - Discuss use cases

### Troubleshooting

**Issue: Application not responding**
- Check if Flask is running: `ps aux | grep flask`
- Restart application: `python src/main/app.py`
- Check port: `lsof -i :8080`

**Issue: Tests fail to run**
- Check backend logs
- Verify pytest is installed: `pip install pytest`
- Check API specification format

**Issue: Docker not working**
- Verify Docker is running: `docker ps`
- Check Docker image: `docker images`
- View logs: `docker logs api-test-generator`

---

## Sample Swagger Files

Located in `docs/eg Swagger/OpenAPI files/`:

1. **jsonplaceholder_api.yaml** - JSONPlaceholder API (recommended for demo)
2. **httpbin_api.yaml** - HTTPBin API
3. **demo_api.json** - Simple demo API
4. **ecommerce_api.yaml** - E-commerce API
5. **example_swagger.yaml** - Generic example

---

## Demo Script Variations

### Short Demo (5 minutes)
1. Introduction
2. Web UI Overview
3. Generate Tests
4. Run Tests
5. Closing

### Full Demo (15 minutes)
1. Introduction
2. Web UI Overview
3. Generate Tests
4. Run Tests
5. Copy & Download
6. API Endpoint Demo
7. Docker Demo
8. CI/CD Integration
9. Q&A

### Technical Demo (20 minutes)
- All of above
- Code walkthrough
- Architecture explanation
- Performance metrics
- Scaling considerations

---

## Audience-Specific Talking Points

### For Developers
- Saves time on test writing
- Consistent test structure
- Easy to customize
- REST API for integration

### For DevOps Engineers
- Docker containerization
- CI/CD integration
- Kubernetes ready
- Monitoring support

### For QA Teams
- Comprehensive test coverage
- Easy to use UI
- Real-time test execution
- Detailed reporting

### For Managers
- Reduces manual effort
- Improves quality
- Faster time to market
- Cost savings

---

## Follow-Up Resources

- **Documentation:** See `docs/` folder
- **GitHub:** https://github.com/NematSachdeva/API-Test-Generator
- **Issues:** Report bugs on GitHub
- **Discussions:** Ask questions on GitHub Discussions

---

## Demo Checklist

- [ ] Application running
- [ ] Browser ready
- [ ] Sample files prepared
- [ ] Terminal ready
- [ ] Docker running (if demoing)
- [ ] Network connection stable
- [ ] Microphone/speakers working
- [ ] Screen sharing configured
- [ ] Backup plan ready

---

**Good luck with your demo!** 🚀
