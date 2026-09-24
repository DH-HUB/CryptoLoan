.PHONY: up down logs test smoke architecture
up:
	docker compose up --build -d
down:
	docker compose down
logs:
	docker compose logs -f backend
test:
	mvn -f backend/pom.xml test
	cd frontend && npm ci && npm run build
smoke:
	./scripts/smoke-test.sh
architecture:
	./scripts/check-architecture.sh

