#!/bin/bash
# Test runner script for API Test Generator

set -e

echo "=========================================="
echo "API Test Generator - Test Runner"
echo "=========================================="
echo ""

# Set PYTHONPATH to include src/main
export PYTHONPATH=$PYTHONPATH:$(pwd)/src/main

echo "PYTHONPATH set to: $PYTHONPATH"
echo ""

# Check if pytest is installed
if ! command -v pytest &> /dev/null; then
    echo "Error: pytest is not installed"
    echo "Run: pip install -r requirements.txt"
    exit 1
fi

echo "Running tests..."
echo ""

# Run tests based on argument
case "${1:-all}" in
    unit)
        echo "Running unit tests only..."
        pytest tests/unit/ -v
        ;;
    integration)
        echo "Running integration tests only..."
        pytest tests/integration/ -v
        ;;
    selenium)
        echo "Running selenium tests only..."
        pytest tests/selenium/ -v
        ;;
    coverage)
        echo "Running tests with coverage..."
        pytest tests/ -v --cov=src/main --cov-report=html --cov-report=term-missing
        echo ""
        echo "Coverage report generated in htmlcov/index.html"
        ;;
    all)
        echo "Running all tests..."
        pytest tests/ -v
        ;;
    *)
        echo "Usage: $0 {unit|integration|selenium|coverage|all}"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "Tests completed successfully!"
echo "=========================================="
