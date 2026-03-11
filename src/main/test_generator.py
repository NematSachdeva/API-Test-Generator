from typing import List, Dict, Any
from datetime import datetime

class APITestGenerator:
    """Generate pytest test cases from parsed API specifications"""
    
    def __init__(self, parser):
        """Initialize test generator with a parser instance
        
        Args:
            parser: SwaggerParser instance with parsed specification
        """
        self.parser = parser
        self.endpoints = parser.get_endpoints()
        self.base_url = parser.get_base_url()
        self.api_title = parser.get_api_title()
        self.api_version = parser.get_api_version()
    
    def generate(self) -> str:
        """Generate complete pytest test file as string
        
        Returns:
            Complete pytest test code as string
        """
        test_code = self._generate_header()
        test_code += self._generate_fixtures()
        test_code += self._generate_test_cases()
        
        return test_code
    
    def _generate_header(self) -> str:
        """Generate file header with imports and metadata
        
        Returns:
            Header section of test file
        """
        header = f'''"""
Auto-generated API tests for {self.api_title} v{self.api_version}
Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

This file contains pytest test cases for all endpoints in the API specification.
Each test sends a request, validates the HTTP status code, and prints the endpoint name.
"""

import pytest
import requests
import json
from typing import Dict, Any

# API Configuration
BASE_URL = "{self.base_url}"
TIMEOUT = 10

'''
        return header
    
    def _generate_fixtures(self) -> str:
        """Generate pytest fixtures
        
        Returns:
            Fixtures section of test file
        """
        fixtures = '''
@pytest.fixture
def api_client():
    """Fixture providing API client session"""
    session = requests.Session()
    session.headers.update({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    })
    yield session
    session.close()


@pytest.fixture
def base_url():
    """Fixture providing base URL"""
    return BASE_URL


'''
        return fixtures
    
    def _generate_test_cases(self) -> str:
        """Generate individual test cases for each endpoint
        
        Returns:
            Test cases section of test file
        """
        test_cases = ""
        
        for idx, endpoint in enumerate(self.endpoints, 1):
            test_cases += self._generate_single_test(endpoint, idx)
            test_cases += "\n\n"
        
        return test_cases
    
    def _generate_single_test(self, endpoint: Dict[str, Any], index: int) -> str:
        """Generate a single test case for an endpoint
        
        Args:
            endpoint: Endpoint dictionary with path, method, etc.
            index: Index of endpoint for unique naming
            
        Returns:
            Single test function as string
        """
        method = endpoint['method'].lower()
        path = endpoint['path']
        summary = endpoint.get('summary', 'Test endpoint')
        endpoint_name = f"{endpoint['method']} {path}"
        
        # Generate test function name
        test_name = self._generate_test_name(method, path, index)
        
        # Generate test body with request sending, status validation, and endpoint printing
        test_body = f'''def {test_name}(api_client, base_url):
    """
    Test: {summary}
    Method: {endpoint['method']}
    Path: {path}
    """
    # Print endpoint name
    endpoint_name = "{endpoint_name}"
    print(f"\\nTesting endpoint: {{endpoint_name}}")
    
    url = f"{{base_url}}{path}"
    print(f"URL: {{url}}")
    
    # Send request using requests library
    try:
        response = api_client.{method}(url, timeout=TIMEOUT)
        
        # Print response details
        print(f"Status Code: {{response.status_code}}")
        print(f"Response Headers: {{dict(response.headers)}}")
        
        # Validate status code
        assert response.status_code in [200, 201, 204, 400, 401, 403, 404, 500], \\
            f"Unexpected status code: {{response.status_code}}"
        
        # Print response body for successful requests
        if response.status_code < 400:
            print(f"Response Body: {{response.text[:200]}}")
            assert response.text, "Response body should not be empty for successful requests"
        
        # Test passed
        print(f"✓ Test passed for {{endpoint_name}}")
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Request failed for {{endpoint_name}}: {{str(e)}}")
        raise
    except AssertionError as e:
        print(f"✗ Assertion failed for {{endpoint_name}}: {{str(e)}}")
        raise
'''
        
        return test_body
    
    def _generate_test_name(self, method: str, path: str, index: int) -> str:
        """Generate unique test function name
        
        Args:
            method: HTTP method (lowercase)
            path: API path
            index: Index for uniqueness
            
        Returns:
            Test function name
        """
        # Clean path: remove leading slash, replace special chars
        clean_path = path.lstrip('/').replace('/', '_').replace('-', '_').replace('{', '').replace('}', '')
        
        # Truncate if too long
        if len(clean_path) > 50:
            clean_path = clean_path[:50]
        
        test_name = f"test_{method}_{clean_path}_{index}"
        
        # Ensure valid Python identifier
        test_name = ''.join(c if c.isalnum() or c == '_' else '_' for c in test_name)
        
        return test_name
    
    def generate_test_file(self, filepath: str) -> None:
        """Generate and write test file to disk
        
        Args:
            filepath: Path where test file should be written
        """
        test_code = self.generate()
        
        with open(filepath, 'w') as f:
            f.write(test_code)
    
    def get_test_summary(self) -> Dict[str, Any]:
        """Get summary of generated tests
        
        Returns:
            Dictionary with test generation summary
        """
        methods_count = {}
        for endpoint in self.endpoints:
            method = endpoint['method']
            methods_count[method] = methods_count.get(method, 0) + 1
        
        return {
            'total_endpoints': len(self.endpoints),
            'methods': methods_count,
            'api_title': self.api_title,
            'api_version': self.api_version,
            'base_url': self.base_url
        }
