#!/usr/bin/env python3
"""
Test script for the /run-tests endpoint
Run this to verify the endpoint works correctly
"""

import requests
import json

# Configuration
BASE_URL = "http://localhost:8080"
# BASE_URL = "https://api-test-generator-production.up.railway.app"

def test_run_tests_passing():
    """Test with passing tests"""
    print("\n" + "="*60)
    print("TEST 1: Running passing tests")
    print("="*60)
    
    test_code = """
import pytest

def test_addition():
    assert 1 + 1 == 2

def test_subtraction():
    assert 5 - 3 == 2

def test_multiplication():
    assert 3 * 4 == 12
"""
    
    response = requests.post(
        f"{BASE_URL}/run-tests",
        json={"test_code": test_code},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Passed: {data['passed']}")
        print(f"Return Code: {data['returncode']}")
        print(f"Summary: {data['summary']}")
        print(f"\nStdout:\n{data['stdout']}")
        if data['stderr']:
            print(f"\nStderr:\n{data['stderr']}")
    else:
        print(f"Error: {response.text}")

def test_run_tests_failing():
    """Test with failing tests"""
    print("\n" + "="*60)
    print("TEST 2: Running failing tests")
    print("="*60)
    
    test_code = """
import pytest

def test_will_pass():
    assert True

def test_will_fail():
    assert 1 + 1 == 3

def test_another_fail():
    assert "hello" == "world"
"""
    
    response = requests.post(
        f"{BASE_URL}/run-tests",
        json={"test_code": test_code},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Passed: {data['passed']}")
        print(f"Return Code: {data['returncode']}")
        print(f"Summary: {data['summary']}")
        print(f"\nStdout (first 500 chars):\n{data['stdout'][:500]}...")
    else:
        print(f"Error: {response.text}")

def test_run_tests_syntax_error():
    """Test with syntax error"""
    print("\n" + "="*60)
    print("TEST 3: Running tests with syntax error")
    print("="*60)
    
    test_code = """
import pytest

def test_syntax_error()
    assert True  # Missing colon
"""
    
    response = requests.post(
        f"{BASE_URL}/run-tests",
        json={"test_code": test_code},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Passed: {data['passed']}")
        print(f"Return Code: {data['returncode']}")
        print(f"Summary: {data['summary']}")
        print(f"\nStderr:\n{data['stderr']}")
    else:
        print(f"Error: {response.text}")

def test_run_tests_no_code():
    """Test with missing test_code"""
    print("\n" + "="*60)
    print("TEST 4: Missing test_code parameter")
    print("="*60)
    
    response = requests.post(
        f"{BASE_URL}/run-tests",
        json={},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_health_check():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("TEST 0: Health Check")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    print("\n🧪 Testing /run-tests Endpoint")
    print("="*60)
    print(f"Base URL: {BASE_URL}")
    print("="*60)
    
    try:
        # Test health first
        test_health_check()
        
        # Run all tests
        test_run_tests_passing()
        test_run_tests_failing()
        test_run_tests_syntax_error()
        test_run_tests_no_code()
        
        print("\n" + "="*60)
        print("✅ All tests completed!")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print(f"\n❌ Error: Could not connect to {BASE_URL}")
        print("Make sure the backend is running:")
        print("  python src/main/app.py")
    except Exception as e:
        print(f"\n❌ Error: {e}")
