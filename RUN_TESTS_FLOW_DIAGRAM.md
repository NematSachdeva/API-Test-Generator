# Run Tests Feature - Flow Diagram

## 🔄 Complete System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (Vercel)                      │
│                     src/main/static/index.html                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1. User clicks "Run Tests"
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND JAVASCRIPT (Vercel)                      │
│                     src/main/static/script.js                        │
│                                                                       │
│  async function runTests() {                                         │
│    1. Validate generatedTestCode exists                             │
│    2. Show loading: "🚀 Running tests..."                           │
│    3. Send POST request to backend                                  │
│    4. Wait for response                                             │
│    5. Display results                                               │
│    6. Show success/error status                                     │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 2. POST /run-tests
                                    │    {test_code: "..."}
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Railway)                           │
│                        src/main/app.py                               │
│                                                                       │
│  @app.route('/run-tests', methods=['POST'])                         │
│  def run_tests():                                                    │
│    1. Validate JSON request                                         │
│    2. Extract test_code                                             │
│    3. Create temporary file                                         │
│    4. Write test_code to file                                       │
│    5. Execute pytest                                                │
│    6. Capture output                                                │
│    7. Parse results                                                 │
│    8. Delete temp file                                              │
│    9. Return JSON response                                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 3. Create temp file
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      TEMPORARY FILE SYSTEM                           │
│                                                                       │
│  /tmp/tmpXXXXXX.py                                                  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ import pytest                                                 │   │
│  │ import requests                                               │   │
│  │                                                               │   │
│  │ def test_get_users():                                         │   │
│  │     response = requests.get("http://localhost:8080/users")   │   │
│  │     assert response.status_code == 200                        │   │
│  │     print("Testing GET /users")                               │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 4. Execute pytest
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         PYTEST EXECUTION                             │
│                                                                       │
│  subprocess.run([                                                    │
│    'pytest',                                                         │
│    '/tmp/tmpXXXXXX.py',                                             │
│    '-v',              # Verbose                                     │
│    '--tb=short',      # Short tracebacks                            │
│    '--color=no'       # No ANSI colors                              │
│  ], timeout=30)                                                      │
│                                                                       │
│  Output:                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ===== test session starts =====                              │   │
│  │ collected 5 items                                             │   │
│  │                                                               │   │
│  │ tmpXXXXXX.py::test_get_users PASSED                [ 20%]    │   │
│  │ tmpXXXXXX.py::test_post_users PASSED               [ 40%]    │   │
│  │ tmpXXXXXX.py::test_get_user_by_id PASSED           [ 60%]    │   │
│  │ tmpXXXXXX.py::test_put_user PASSED                 [ 80%]    │   │
│  │ tmpXXXXXX.py::test_delete_user PASSED              [100%]    │   │
│  │                                                               │   │
│  │ ===== 5 passed in 0.35s =====                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 5. Parse output
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        RESULT PARSING                                │
│                                                                       │
│  import re                                                           │
│                                                                       │
│  # Extract passed count                                             │
│  match = re.search(r'(\d+) passed', stdout)                         │
│  count = match.group(1)  # "5"                                      │
│                                                                       │
│  # Create summary                                                    │
│  summary = f"✅ {count} tests passed successfully!"                 │
│                                                                       │
│  # Determine pass/fail                                              │
│  passed = (returncode == 0)                                         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 6. Return JSON
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         JSON RESPONSE                                │
│                                                                       │
│  {                                                                   │
│    "status": "success",                                             │
│    "stdout": "===== test session starts =====\n...",               │
│    "stderr": "",                                                    │
│    "returncode": 0,                                                 │
│    "passed": true,                                                  │
│    "summary": "✅ 5 tests passed successfully!"                     │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 7. Receive response
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND DISPLAY (Vercel)                         │
│                                                                       │
│  function displayTestResults(data) {                                │
│    // Store results                                                 │
│    testResults = data;                                              │
│                                                                       │
│    // Update code output                                            │
│    codeOutput.textContent = data.stdout;                            │
│                                                                       │
│    // Show View Code button                                         │
│    viewCodeBtn.style.display = 'inline-flex';                       │
│                                                                       │
│    // Show status                                                    │
│    showStatus(data.summary, 'success');                             │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 8. Display to user
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         USER SEES RESULTS                            │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Generated Tests                                                │ │
│  │ 🔵 5 endpoints detected                                        │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ 💻 pytest                                                      │ │
│  │ [Copy] [Download] [Run Tests] [View Code]                     │ │
│  ├───────────────────────────────────────────────────────────────┤ │
│  │ ===== test session starts =====                                │ │
│  │ collected 5 items                                               │ │
│  │                                                                 │ │
│  │ tmpXXXXXX.py::test_get_users PASSED                  [ 20%]   │ │
│  │ tmpXXXXXX.py::test_post_users PASSED                 [ 40%]   │ │
│  │ tmpXXXXXX.py::test_get_user_by_id PASSED             [ 60%]   │ │
│  │ tmpXXXXXX.py::test_put_user PASSED                   [ 80%]   │ │
│  │ tmpXXXXXX.py::test_delete_user PASSED                [100%]   │ │
│  │                                                                 │ │
│  │ ===== 5 passed in 0.35s =====                                  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  Status: ✅ 5 tests passed successfully!                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔀 Alternative Flows

### Flow A: Tests Fail

```
User clicks "Run Tests"
    ↓
Backend executes pytest
    ↓
Some tests fail (returncode = 1)
    ↓
Parse output: "2 failed"
    ↓
Return: {
  "passed": false,
  "summary": "❌ 2 tests failed",
  "stdout": "...failure details..."
}
    ↓
Frontend displays failure output
    ↓
Status: ❌ 2 tests failed
```

### Flow B: Syntax Error

```
User clicks "Run Tests"
    ↓
Backend executes pytest
    ↓
Syntax error in code (returncode = 4)
    ↓
Parse output: "1 error"
    ↓
Return: {
  "passed": false,
  "summary": "❌ 1 errors occurred",
  "stderr": "SyntaxError: ..."
}
    ↓
Frontend displays error
    ↓
Status: ❌ 1 errors occurred
```

### Flow C: Timeout

```
User clicks "Run Tests"
    ↓
Backend executes pytest
    ↓
Test runs for > 30 seconds
    ↓
subprocess.TimeoutExpired raised
    ↓
Return: {
  "error": "Test execution timed out (30 seconds)",
  "status": "timeout"
}
    ↓
Frontend displays error
    ↓
Status: ❌ Test execution timed out
```

---

## 🔄 View Code Toggle Flow

```
User viewing test results
    ↓
Clicks "View Code" button
    ↓
viewGeneratedCode() called
    ↓
Restore original code:
  codeOutput.textContent = generatedTestCode
    ↓
Hide "View Code" button
    ↓
Show status: "Viewing generated test code"
    ↓
User can click "Run Tests" again
```

---

## 📊 State Management

```
┌─────────────────────────────────────────┐
│         JavaScript State                 │
├─────────────────────────────────────────┤
│ selectedFile: File | null               │
│ generatedTestCode: string | null        │
│ testResults: object | null              │
└─────────────────────────────────────────┘
         │              │              │
         │              │              │
         ↓              ↓              ↓
    Upload File   Generate Tests   Run Tests
         │              │              │
         │              │              │
         ↓              ↓              ↓
    Set file      Set code        Set results
```

---

## 🔐 Security Flow

```
Request arrives
    ↓
Validate JSON structure
    ↓
Validate test_code exists
    ↓
Validate test_code is string
    ↓
Create temp file (unique name)
    ↓
Write code to file
    ↓
Execute pytest with timeout
    │
    ├─ Success → Capture output
    │
    ├─ Timeout → Raise TimeoutExpired
    │
    └─ Error → Capture error
    ↓
Delete temp file (always)
    ↓
Return results
```

---

## 📈 Performance Timeline

```
Time (ms)    Event
─────────────────────────────────────────────────
0            User clicks "Run Tests"
10           Frontend validates code
20           Send POST request
50           Request reaches backend
60           Validate JSON
70           Create temp file
80           Write code to file
90           Start pytest subprocess
300          Pytest startup complete
350          Tests begin executing
600          Tests complete (5 tests)
610          Capture output
620          Parse results
630          Delete temp file
640          Return JSON response
670          Response reaches frontend
680          Parse JSON
690          Update UI
700          Display results
─────────────────────────────────────────────────
Total: ~700ms for 5 tests
```

---

## 🎯 Error Handling Flow

```
                    Request
                       ↓
              ┌────────┴────────┐
              │                 │
         Valid JSON?        Invalid
              │                 │
             Yes                ↓
              │            400 Bad Request
              ↓
         test_code exists?
              │
         ┌────┴────┐
        Yes       No
         │         │
         │         ↓
         │    400 Bad Request
         │
         ↓
    Create temp file
         │
         ↓
    Execute pytest
         │
    ┌────┴────┐
    │         │
 Success   Timeout
    │         │
    │         ↓
    │    408 Timeout
    │
    ↓
 Cleanup
    │
    ↓
 Return 200
```

---

## 🔄 Complete User Journey

```
1. Landing Page
   ↓
2. Upload Swagger File
   ↓
3. Click "Generate Tests"
   ↓
4. View Generated Code
   ├─ Copy Code
   ├─ Download Code
   └─ Run Tests ← NEW!
      ↓
5. View Test Results ← NEW!
   ├─ See pytest output
   ├─ See pass/fail status
   └─ View Code ← NEW!
      ↓
6. Back to Generated Code
   └─ Can run tests again
```

---

**Version:** 8.0  
**Status:** ✅ Complete  
**Diagram Type:** System Flow
