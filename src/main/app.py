from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import json
import yaml
import os
import subprocess
import tempfile
from parser import SwaggerParser
from test_generator import APITestGenerator

app = Flask(__name__, static_folder='static', static_url_path='/static')

# Enable CORS for all routes to allow Vercel frontend to call Railway backend
CORS(app, resources={
    r"/*": {
        "origins": ["*"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"]
    }
})

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
UPLOAD_FOLDER = os.environ.get('UPLOAD_FOLDER', '/tmp')
ALLOWED_EXTENSIONS = {'json', 'yaml', 'yml'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files with cache-busting headers"""
    import time
    response = send_from_directory('static', filename)
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    response.headers['Last-Modified'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime())
    return response

@app.route('/ui', methods=['GET'])
def serve_frontend():
    """Serve the frontend HTML"""
    import time
    import os
    # Read the file directly and return with strong cache-busting headers
    filepath = os.path.join(app.static_folder, 'index.html')
    with open(filepath, 'r') as f:
        html_content = f.read()
    
    response = app.response_class(
        response=html_content,
        status=200,
        mimetype='text/html'
    )
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '-1'
    response.headers['X-UI-Version'] = 'v3.0-dark-theme'
    response.headers['Last-Modified'] = time.strftime('%a, %d %b %Y %H:%M:%S GMT', time.gmtime())
    return response

@app.route('/test-version', methods=['GET'])
def test_version():
    """Test endpoint to verify which version is running"""
    return jsonify({'version': 'v3.0-dark-theme', 'timestamp': '2026-03-10-21:30'}), 200

@app.route('/', methods=['GET'])
def root():
    """Root endpoint - API information and available endpoints"""
    return jsonify({
        'service': 'API Test Generator',
        'version': '1.0.0',
        'description': 'Automatically generate pytest-based API test cases from OpenAPI/Swagger specifications',
        'documentation': 'https://github.com/your-repo/api-test-generator',
        'endpoints': {
            'GET /': {
                'description': 'API information and available endpoints',
                'method': 'GET',
                'response': 'JSON with service info and endpoint list'
            },
            'GET /health': {
                'description': 'Health check endpoint',
                'method': 'GET',
                'response': 'JSON with service status'
            },
            'POST /generate-tests': {
                'description': 'Generate pytest test cases from OpenAPI/Swagger specification',
                'method': 'POST',
                'accepts': ['multipart/form-data (file upload)', 'application/json (spec body)'],
                'parameters': {
                    'file': 'OpenAPI/Swagger JSON or YAML file (optional)',
                    'body': 'OpenAPI/Swagger specification as JSON (optional)'
                },
                'response': 'JSON with generated test code and endpoint count'
            },
            'POST /parse': {
                'description': 'Parse OpenAPI/Swagger specification and extract endpoints',
                'method': 'POST',
                'accepts': ['multipart/form-data (file upload)', 'application/json (spec body)'],
                'parameters': {
                    'file': 'OpenAPI/Swagger JSON or YAML file (optional)',
                    'body': 'OpenAPI/Swagger specification as JSON (optional)'
                },
                'response': 'JSON with extracted endpoints and count'
            },
            'POST /run-tests': {
                'description': 'Execute pytest on generated test code and return results',
                'method': 'POST',
                'accepts': ['application/json'],
                'parameters': {
                    'test_code': 'String containing pytest test code to execute'
                },
                'response': 'JSON with stdout, stderr, returncode, passed status, and summary'
            }
        },
        'features': [
            'Parse OpenAPI 3.0 and Swagger 2.0 specifications',
            'Extract all endpoints and HTTP methods',
            'Generate production-ready pytest test code',
            'Execute pytest tests and return results',
            'Support for JSON and YAML formats',
            'Comprehensive error handling',
            'Health checks and monitoring'
        ],
        'usage': {
            'generate_tests_from_file': 'curl -X POST -F "file=@swagger.json" http://localhost:8080/generate-tests',
            'generate_tests_from_json': 'curl -X POST -H "Content-Type: application/json" -d @swagger.json http://localhost:8080/generate-tests',
            'parse_endpoints': 'curl -X POST -H "Content-Type: application/json" -d @swagger.json http://localhost:8080/parse',
            'run_tests': 'curl -X POST -H "Content-Type: application/json" -d \'{"test_code":"import pytest\\ndef test_example():\\n    assert True"}\' http://localhost:8080/run-tests',
            'health_check': 'curl http://localhost:8080/health'
        }
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'API Test Generator'}), 200

@app.route('/generate-tests', methods=['POST'])
def generate_tests():
    """Generate pytest test cases from OpenAPI/Swagger specification
    
    Accepts either:
    - File upload: multipart/form-data with 'file' field
    - JSON body: application/json with spec content
    """
    try:
        spec = None
        
        # Check for file upload
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not allowed_file(file.filename):
                return jsonify({'error': 'File must be JSON or YAML'}), 400
            
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            try:
                spec = SwaggerParser.load_from_file(filepath)
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)
        
        # Check for JSON body
        elif request.is_json:
            spec = request.get_json()
        
        else:
            return jsonify({'error': 'No file or JSON body provided'}), 400
        
        if not spec:
            return jsonify({'error': 'Invalid specification'}), 400
        
        # Parse and generate tests
        parser = SwaggerParser(spec)
        generator = APITestGenerator(parser)
        test_code = generator.generate()
        
        return jsonify({
            'status': 'success',
            'test_code': test_code,
            'endpoints_count': len(parser.get_endpoints())
        }), 200
    
    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid JSON format'}), 400
    except yaml.YAMLError as e:
        return jsonify({'error': f'Invalid YAML format: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/parse', methods=['POST'])
def parse_spec():
    """Parse OpenAPI spec and return extracted endpoints"""
    try:
        spec = None
        
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            if not allowed_file(file.filename):
                return jsonify({'error': 'File must be JSON or YAML'}), 400
            
            filename = secure_filename(file.filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            
            try:
                spec = SwaggerParser.load_from_file(filepath)
            finally:
                if os.path.exists(filepath):
                    os.remove(filepath)
        
        elif request.is_json:
            spec = request.get_json()
        
        else:
            return jsonify({'error': 'No file or JSON body provided'}), 400
        
        parser = SwaggerParser(spec)
        endpoints = parser.get_endpoints()
        
        return jsonify({
            'status': 'success',
            'endpoints': endpoints,
            'count': len(endpoints)
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/run-tests', methods=['POST'])
def run_tests():
    """Execute pytest on generated test code and return results
    
    Accepts JSON body with:
    - test_code: string containing pytest test code
    
    Returns:
    - stdout: pytest output
    - stderr: error output
    - returncode: exit code (0 = success, non-zero = failure)
    - passed: boolean indicating if all tests passed
    - summary: human-readable summary
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
        
        data = request.get_json()
        test_code = data.get('test_code')
        
        if not test_code:
            return jsonify({'error': 'test_code is required'}), 400
        
        if not isinstance(test_code, str):
            return jsonify({'error': 'test_code must be a string'}), 400
        
        # Create temporary file for test code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp_file:
            temp_file.write(test_code)
            temp_file_path = temp_file.name
        
        try:
            # Run pytest on the temporary file
            # Use -v for verbose output, --tb=short for shorter tracebacks
            result = subprocess.run(
                ['pytest', temp_file_path, '-v', '--tb=short', '--color=no'],
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout for safety
            )
            
            stdout = result.stdout
            stderr = result.stderr
            returncode = result.returncode
            
            # Determine if tests passed
            passed = returncode == 0
            
            # Create summary
            if passed:
                # Extract passed count from output
                import re
                match = re.search(r'(\d+) passed', stdout)
                count = match.group(1) if match else 'All'
                summary = f'✅ {count} tests passed successfully!'
            else:
                # Extract failed/error count
                import re
                failed_match = re.search(r'(\d+) failed', stdout)
                error_match = re.search(r'(\d+) error', stdout)
                
                failed_count = failed_match.group(1) if failed_match else '0'
                error_count = error_match.group(1) if error_match else '0'
                
                if error_count != '0':
                    summary = f'❌ {error_count} errors occurred during test execution'
                else:
                    summary = f'❌ {failed_count} tests failed'
            
            return jsonify({
                'status': 'success',
                'stdout': stdout,
                'stderr': stderr,
                'returncode': returncode,
                'passed': passed,
                'summary': summary
            }), 200
        
        finally:
            # Clean up temporary file
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
    
    except subprocess.TimeoutExpired:
        return jsonify({
            'error': 'Test execution timed out (30 seconds)',
            'status': 'timeout'
        }), 408
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Get port from environment or default to 8080
    port = int(os.environ.get('PORT', 8080))
    # Get host from environment or default to 0.0.0.0
    host = os.environ.get('HOST', '0.0.0.0')
    # Get debug mode from environment
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    app.run(host=host, port=port, debug=debug)
