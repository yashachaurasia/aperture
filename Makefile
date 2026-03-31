.PHONY: up down reset logs

up:
	@if [ ! -f .env ]; then cp .env.example .env; echo "Created .env from .env.example"; fi
	docker-compose up --build

down:
	docker-compose down

reset:
	docker-compose down -v
	docker-compose build --no-cache
	docker-compose up

logs:
	docker-compose logs -f