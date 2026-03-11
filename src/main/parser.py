import yaml
import json
import os
from typing import Dict, List, Any, Optional

class SwaggerParser:
    """Parse OpenAPI/Swagger specifications and extract endpoint information"""
    
    def __init__(self, spec: Dict[str, Any]):
        """Initialize parser with OpenAPI/Swagger specification
        
        Args:
            spec: Dictionary containing the OpenAPI/Swagger specification
        """
        self.spec = spec
        self.paths = spec.get('paths', {})
        self.components = spec.get('components', {})
        self.definitions = spec.get('definitions', {})  # Swagger 2.0
        self.info = spec.get('info', {})
        self.base_path = spec.get('basePath', '')  # Swagger 2.0
        self.servers = spec.get('servers', [])  # OpenAPI 3.0
    
    def get_endpoints(self) -> List[Dict[str, Any]]:
        """Extract all API endpoints from specification
        
        Returns:
            List of endpoint dictionaries with path, method, and details
        """
        endpoints = []
        
        if not self.paths:
            return endpoints
        
        for path, methods in self.paths.items():
            if not isinstance(methods, dict):
                continue
                
            for method, details in methods.items():
                # Skip non-HTTP method keys like 'parameters', 'servers'
                if method.lower() not in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
                    continue
                
                if not isinstance(details, dict):
                    continue
                
                endpoint = {
                    'path': path,
                    'method': method.upper(),
                    'summary': details.get('summary', ''),
                    'description': details.get('description', ''),
                    'parameters': self._extract_parameters(details),
                    'request_body': self._extract_request_body(details),
                    'responses': self._extract_responses(details),
                    'tags': details.get('tags', [])
                }
                endpoints.append(endpoint)
        
        return endpoints
    
    def _extract_parameters(self, details: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract parameters from endpoint details
        
        Args:
            details: Endpoint details dictionary
            
        Returns:
            List of parameter dictionaries
        """
        parameters = []
        
        for param in details.get('parameters', []):
            param_info = {
                'name': param.get('name', ''),
                'in': param.get('in', ''),
                'required': param.get('required', False),
                'type': param.get('type', param.get('schema', {}).get('type', 'string'))
            }
            parameters.append(param_info)
        
        return parameters
    
    def _extract_request_body(self, details: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Extract request body information
        
        Args:
            details: Endpoint details dictionary
            
        Returns:
            Request body information or None
        """
        request_body = details.get('requestBody')
        if not request_body:
            return None
        
        return {
            'required': request_body.get('required', False),
            'content_types': list(request_body.get('content', {}).keys())
        }
    
    def _extract_responses(self, details: Dict[str, Any]) -> Dict[str, Any]:
        """Extract response information
        
        Args:
            details: Endpoint details dictionary
            
        Returns:
            Dictionary of response status codes and descriptions
        """
        responses = {}
        
        for status_code, response_info in details.get('responses', {}).items():
            responses[status_code] = response_info.get('description', '')
        
        return responses
    
    def get_base_url(self) -> str:
        """Get base URL from specification
        
        Returns:
            Base URL string
        """
        # OpenAPI 3.0
        if self.servers:
            return self.servers[0].get('url', '')
        
        # Swagger 2.0
        scheme = self.spec.get('schemes', ['http'])[0]
        host = self.spec.get('host', 'localhost')
        base_path = self.base_path or ''
        
        return f"{scheme}://{host}{base_path}"
    
    def get_api_title(self) -> str:
        """Get API title from specification
        
        Returns:
            API title string
        """
        return self.info.get('title', 'API')
    
    def get_api_version(self) -> str:
        """Get API version from specification
        
        Returns:
            API version string
        """
        return self.info.get('version', '1.0.0')
    
    @staticmethod
    def load_from_file(filepath: str) -> Dict[str, Any]:
        """Load OpenAPI/Swagger specification from file
        
        Args:
            filepath: Path to YAML or JSON file
            
        Returns:
            Parsed specification dictionary
            
        Raises:
            FileNotFoundError: If file doesn't exist
            ValueError: If file format is invalid
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")
        
        with open(filepath, 'r') as f:
            try:
                if filepath.endswith(('.yaml', '.yml')):
                    spec = yaml.safe_load(f)
                    if not isinstance(spec, dict):
                        raise ValueError("YAML file must contain a dictionary at root level")
                    return spec
                elif filepath.endswith('.json'):
                    spec = json.load(f)
                    if not isinstance(spec, dict):
                        raise ValueError("JSON file must contain a dictionary at root level")
                    return spec
                else:
                    raise ValueError("File must be YAML or JSON format")
            except (json.JSONDecodeError, yaml.YAMLError) as e:
                raise ValueError(f"Failed to parse file: {str(e)}")
    
    @staticmethod
    def load_from_string(content: str, format_type: str = 'json') -> Dict[str, Any]:
        """Load OpenAPI/Swagger specification from string
        
        Args:
            content: String content of specification
            format_type: 'json' or 'yaml'
            
        Returns:
            Parsed specification dictionary
            
        Raises:
            ValueError: If content format is invalid
        """
        if format_type == 'json':
            return json.loads(content)
        elif format_type in ('yaml', 'yml'):
            return yaml.safe_load(content)
        else:
            raise ValueError("Format must be 'json' or 'yaml'")
