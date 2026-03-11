import pytest
import sys
import json
from pathlib import Path
from io import BytesIO

sys.path.insert(0, str(Path(__file__).parent.parent / 'src' / 'main'))

from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    """Test health check endpoint"""
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json['status'] == 'healthy'

def test_root_endpoint(client):
    """Test root endpoint"""
    response = client.get('/')
    assert response.status_code == 200
    assert response.json['service'] == 'API Test Generator'
    assert 'endpoints' in response.json
    assert 'features' in response.json
    assert 'usage' in response.json
    assert 'GET /' in response.json['endpoints']
    assert 'GET /health' in response.json['endpoints']
    assert 'POST /generate-tests' in response.json['endpoints']
    assert 'POST /parse' in response.json['endpoints']

def test_generate_tests_with_json(client):
    """Test generate-tests endpoint with JSON body"""
    spec = {
        'openapi': '3.0.0',
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'paths': {
            '/users': {
                'get': {
                    'summary': 'Get all users',
                    'responses': {'200': {'description': 'Success'}}
                }
            }
        }
    }
    response = client.post('/generate-tests', json=spec)
    assert response.status_code == 200
    assert response.json['status'] == 'success'
    assert 'test_code' in response.json
    assert response.json['endpoints_count'] == 1
    assert 'def test_' in response.json['test_code']

def test_generate_tests_with_file(client):
    """Test generate-tests endpoint with file upload"""
    spec = {
        'openapi': '3.0.0',
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'paths': {
            '/users': {
                'get': {'summary': 'Get users', 'responses': {'200': {'description': 'Success'}}},
                'post': {'summary': 'Create user', 'responses': {'201': {'description': 'Created'}}}
            }
        }
    }
    
    data = {
        'file': (BytesIO(json.dumps(spec).encode()), 'spec.json')
    }
    response = client.post('/generate-tests', data=data, content_type='multipart/form-data')
    assert response.status_code == 200
    assert response.json['status'] == 'success'
    assert response.json['endpoints_count'] == 2

def test_parse_endpoint(client):
    """Test parse endpoint"""
    spec = {
        'openapi': '3.0.0',
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'paths': {
            '/users/{id}': {
                'get': {
                    'summary': 'Get user by ID',
                    'parameters': [{'name': 'id', 'in': 'path', 'required': True}],
                    'responses': {'200': {'description': 'Success'}}
                }
            }
        }
    }
    response = client.post('/parse', json=spec)
    assert response.status_code == 200
    assert response.json['status'] == 'success'
    assert response.json['count'] == 1
    assert response.json['endpoints'][0]['method'] == 'GET'
    assert response.json['endpoints'][0]['path'] == '/users/{id}'

def test_generate_tests_no_input(client):
    """Test generate-tests with no input"""
    response = client.post('/generate-tests')
    assert response.status_code == 400
    assert 'error' in response.json

def test_invalid_file_format(client):
    """Test with invalid file format"""
    data = {
        'file': (BytesIO(b'invalid'), 'spec.txt')
    }
    response = client.post('/generate-tests', data=data, content_type='multipart/form-data')
    assert response.status_code == 400
    assert 'error' in response.json
