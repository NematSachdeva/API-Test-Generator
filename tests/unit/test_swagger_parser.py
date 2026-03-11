import pytest

from parser import SwaggerParser
from test_generator import APITestGenerator

def test_get_endpoints():
    """Test endpoint extraction from spec"""
    spec = {
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'paths': {
            '/users': {
                'get': {'summary': 'Get users', 'responses': {'200': {'description': 'Success'}}},
                'post': {'summary': 'Create user', 'responses': {'201': {'description': 'Created'}}}
            }
        }
    }
    parser = SwaggerParser(spec)
    endpoints = parser.get_endpoints()
    
    assert len(endpoints) == 2
    assert endpoints[0]['method'] == 'GET'
    assert endpoints[1]['method'] == 'POST'
    assert endpoints[0]['path'] == '/users'

def test_extract_parameters():
    """Test parameter extraction"""
    spec = {
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'paths': {
            '/users/{id}': {
                'get': {
                    'summary': 'Get user',
                    'parameters': [
                        {'name': 'id', 'in': 'path', 'required': True, 'type': 'integer'}
                    ],
                    'responses': {'200': {'description': 'Success'}}
                }
            }
        }
    }
    parser = SwaggerParser(spec)
    endpoints = parser.get_endpoints()
    
    assert len(endpoints[0]['parameters']) == 1
    assert endpoints[0]['parameters'][0]['name'] == 'id'
    assert endpoints[0]['parameters'][0]['required'] is True

def test_get_base_url():
    """Test base URL extraction"""
    spec = {
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'servers': [{'url': 'https://api.example.com'}],
        'paths': {}
    }
    parser = SwaggerParser(spec)
    assert parser.get_base_url() == 'https://api.example.com'

def test_get_api_info():
    """Test API info extraction"""
    spec = {
        'info': {'title': 'My API', 'version': '2.0.0'},
        'paths': {}
    }
    parser = SwaggerParser(spec)
    assert parser.get_api_title() == 'My API'
    assert parser.get_api_version() == '2.0.0'

def test_test_generator():
    """Test test code generation"""
    spec = {
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'servers': [{'url': 'https://api.test.com'}],
        'paths': {
            '/users': {
                'get': {'summary': 'Get all users', 'responses': {'200': {'description': 'Success'}}}
            }
        }
    }
    parser = SwaggerParser(spec)
    generator = APITestGenerator(parser)
    test_code = generator.generate()
    
    assert 'import pytest' in test_code
    assert 'import requests' in test_code
    assert 'def test_' in test_code
    assert 'assert response.status_code' in test_code
    assert 'BASE_URL = "https://api.test.com"' in test_code

def test_test_generator_summary():
    """Test test generation summary"""
    spec = {
        'info': {'title': 'Test API', 'version': '1.0.0'},
        'servers': [{'url': 'https://api.test.com'}],
        'paths': {
            '/users': {
                'get': {'summary': 'Get users', 'responses': {'200': {'description': 'Success'}}},
                'post': {'summary': 'Create user', 'responses': {'201': {'description': 'Created'}}}
            },
            '/posts': {
                'get': {'summary': 'Get posts', 'responses': {'200': {'description': 'Success'}}}
            }
        }
    }
    parser = SwaggerParser(spec)
    generator = APITestGenerator(parser)
    summary = generator.get_test_summary()
    
    assert summary['total_endpoints'] == 3
    assert summary['methods']['GET'] == 2
    assert summary['methods']['POST'] == 1
    assert summary['api_title'] == 'Test API'
