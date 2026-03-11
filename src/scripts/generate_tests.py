#!/usr/bin/env python3
"""CLI script to generate tests from OpenAPI spec file"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / 'main'))

from parser import SwaggerParser
from test_generator import TestGenerator

def main():
    if len(sys.argv) < 2:
        print("Usage: python generate_tests.py <spec_file> [output_file]")
        print("\nExample:")
        print("  python generate_tests.py openapi.json")
        print("  python generate_tests.py openapi.yaml test_api.py")
        sys.exit(1)
    
    spec_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'test_generated.py'
    
    try:
        # Load specification
        spec = SwaggerParser.load_from_file(spec_file)
        
        # Parse and generate tests
        parser = SwaggerParser(spec)
        generator = TestGenerator(parser)
        
        # Generate test code
        test_code = generator.generate()
        
        # Write to file
        generator.generate_test_file(output_file)
        
        # Print summary
        summary = generator.get_test_summary()
        print(f"✓ Generated tests for {summary['api_title']} v{summary['api_version']}")
        print(f"✓ Total endpoints: {summary['total_endpoints']}")
        print(f"✓ Methods: {summary['methods']}")
        print(f"✓ Output file: {output_file}")
        
    except FileNotFoundError:
        print(f"Error: File '{spec_file}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
