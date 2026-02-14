# 2025-portfolio Makefile
# Usage: make <target>

IMAGE_NAME   := 2025-portfolio
IMAGE_TAG    := latest
CONTAINER    := 2025-portfolio
PORT         := 3000

.PHONY: help build run run-detach stop clean smoke dev dev-docker dev-docker-down lint test docker-up docker-down

help:
	@echo "Targets:"
	@echo "  make build         - Build Docker image ($(IMAGE_NAME):$(IMAGE_TAG))"
	@echo "  make run           - Run container (foreground, port $(PORT))"
	@echo "  make run-detach    - Run container in background"
	@echo "  make stop          - Stop and remove container"
	@echo "  make clean         - Stop container and remove image"
	@echo "  make smoke         - Build, run, curl localhost:$(PORT), stop"
	@echo "  make dev           - Run Next.js dev server locally (watch + hot reload)"
	@echo "  make dev-docker    - Run Next.js dev server in Docker (watch + hot reload)"
	@echo "  make dev-docker-down - Stop dev Docker container"
	@echo "  make lint          - Run ESLint"
	@echo "  make test          - Run Vitest tests"
	@echo "  make docker-up     - Start production with docker-compose up -d"
	@echo "  make docker-down   - Stop docker-compose"

build:
	docker build -t $(IMAGE_NAME):$(IMAGE_TAG) .

run: build
	docker run --rm -p $(PORT):3000 --name $(CONTAINER) $(IMAGE_NAME):$(IMAGE_TAG)

run-detach: build
	docker run -d -p $(PORT):3000 --name $(CONTAINER) $(IMAGE_NAME):$(IMAGE_TAG)
	@echo "Container $(CONTAINER) running at http://localhost:$(PORT)"

stop:
	docker stop $(CONTAINER) 2>/dev/null || true
	docker rm $(CONTAINER) 2>/dev/null || true

clean: stop
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true

smoke: build
	docker run -d -p $(PORT):3000 --name $(CONTAINER)-smoke $(IMAGE_NAME):$(IMAGE_TAG)
	sleep 5
	curl -sf --connect-timeout 10 http://localhost:$(PORT)/ && echo "OK"
	@$(MAKE) stop CONTAINER=$(CONTAINER)-smoke

dev:
	npm run dev

lint:
	npm run lint

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

commit:
	git add .
	git commit -m "Update: $(message)"
	git push

test:
	npm run test

