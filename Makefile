.PHONY: help build run stop logs clean test docker-build docker-run docker-stop docker-logs docker-clean

# Variables
DOCKER_IMAGE := api-test-generator
DOCKER_TAG := latest
DOCKER_REGISTRY := 
DOCKER_COMPOSE_FILE := infrastructure/docker/docker-compose.yml
CONTAINER_NAME := api-test-generator
PORT := 8080

help:
	@echo "API Test Generator - Makefile Commands"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make docker-build       Build Docker image"
	@echo "  make docker-run         Run Docker container"
	@echo "  make docker-stop        Stop Docker container"
	@echo "  make docker-logs        View Docker logs"
	@echo "  make docker-clean       Clean Docker resources"
	@echo ""
	@echo "Docker Compose Commands:"
	@echo "  make compose-up         Start services with Docker Compose"
	@echo "  make compose-down       Stop services with Docker Compose"
	@echo "  make compose-logs       View Docker Compose logs"
	@echo "  make compose-build      Build Docker Compose image"
	@echo ""
	@echo "Development Commands:"
	@echo "  make install            Install dependencies"
	@echo "  make test               Run tests"
	@echo "  make run                Run Flask app locally"
	@echo ""
	@echo "Utility Commands:"
	@echo "  make health-check       Check API health"
	@echo "  make clean              Clean up local files"
	@echo "  make help               Show this help message"

# Docker Commands
docker-build:
	@echo "Building Docker image: $(DOCKER_IMAGE):$(DOCKER_TAG)"
	docker build -f infrastructure/docker/Dockerfile \
		-t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	@echo "✓ Docker image built successfully"

docker-run:
	@echo "Running Docker container on port $(PORT)"
	docker run -d -p $(PORT):8080 \
		--name $(CONTAINER_NAME) \
		$(DOCKER_IMAGE):$(DOCKER_TAG)
	@echo "✓ Container started: http://localhost:$(PORT)"

docker-stop:
	@echo "Stopping Docker container"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	@echo "✓ Container stopped"

docker-logs:
	@echo "Viewing Docker logs"
	docker logs -f $(CONTAINER_NAME)

docker-clean:
	@echo "Cleaning Docker resources"
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true
	docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG) || true
	@echo "✓ Docker resources cleaned"

# Docker Compose Commands
compose-up:
	@echo "Starting services with Docker Compose"
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "✓ Services started"

compose-down:
	@echo "Stopping services with Docker Compose"
	docker-compose -f $(DOCKER_COMPOSE_FILE) down
	@echo "✓ Services stopped"

compose-logs:
	@echo "Viewing Docker Compose logs"
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

compose-build:
	@echo "Building Docker Compose image"
	docker-compose -f $(DOCKER_COMPOSE_FILE) build --no-cache
	@echo "✓ Image built"

# Development Commands
install:
	@echo "Installing dependencies"
	pip install -r requirements.txt
	@echo "✓ Dependencies installed"

test:
	@echo "Running tests"
	pytest tests/ -v
	@echo "✓ Tests completed"

run:
	@echo "Running Flask app locally"
	python src/main/app.py

# Utility Commands
health-check:
	@echo "Checking API health"
	curl -s http://localhost:$(PORT)/health | jq . || echo "API not responding"

clean:
	@echo "Cleaning up local files"
	find . -type d -name __pycache__ -exec rm -rf {} + || true
	find . -type f -name "*.pyc" -delete || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + || true
	find . -type d -name ".coverage" -exec rm -rf {} + || true
	@echo "✓ Cleanup completed"

# Combined Commands
build: docker-build
	@echo "✓ Build completed"

run-docker: docker-stop docker-build docker-run
	@echo "✓ Docker container is running on port $(PORT)"

stop: docker-stop
	@echo "✓ Stopped"

logs: docker-logs

all: install test docker-build docker-run
	@echo "✓ All tasks completed"

.DEFAULT_GOAL := help
