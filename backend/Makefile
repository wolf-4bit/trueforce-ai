# Database Migration with Atlas
MIGRATIONS_DIR := file://migrations

# Load environment variables from .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Construct database URL - override this if DB_URL is already set in your environment
DB_URL ?= postgres://$(DB_USER):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_NAME)?sslmode=disable

# Print current database connection (without password)
print-db-info:
	@echo "Database URL: $(DB_URL)"
ifdef DB_URL
	@echo "Database configuration (parsed from DB_URL):"
	@echo "  Host: $(shell echo $(DB_URL) | sed -n 's/.*@\([^:]*\).*/\1/p')"
	@echo "  Port: $(shell echo $(DB_URL) | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')"
	@echo "  Name: $(shell echo $(DB_URL) | sed -n 's/.*\/\([^?]*\).*/\1/p')"
	@echo "  User: $(shell echo $(DB_URL) | sed -n 's/postgres:\/\/\([^:]*\).*/\1/p')"
	@echo "  SSL Mode: $(shell echo $(DB_URL) | grep -o 'sslmode=[^&]*' | cut -d= -f2)"
else
	@echo "Database configuration:"
	@echo "  Host: $(DB_HOST)"
	@echo "  Port: $(DB_PORT)"
	@echo "  Name: $(DB_NAME)"
	@echo "  User: $(DB_USER)"
	@echo "  SSL Mode: $(DB_SSLMODE)"
endif

ensure-migrations-dir:
	@mkdir -p migrations

migrate-diff: ensure-migrations-dir
	@echo "Generating migration from GORM models..."
	atlas migrate diff $(if $(name),$(name),update_schema) \
		--env gorm

migrate-apply: ensure-migrations-dir
	@echo "Applying migrations..."
	atlas migrate apply \
		--url "$(DB_URL)" \
		--dir $(MIGRATIONS_DIR)

migrate-status: ensure-migrations-dir
	@echo "Migration status:"
	atlas migrate status \
		--url "$(DB_URL)" \
		--dir $(MIGRATIONS_DIR)

migrate-new: ensure-migrations-dir
	@echo "Creating new migration..."
	atlas migrate new \
		$(if $(name),$(name),new_migration) \
		--dir $(MIGRATIONS_DIR)

# Verify migrations without applying them
migrate-verify: ensure-migrations-dir
	@echo "Verifying migrations..."
	atlas migrate apply \
		--url "$(DB_URL)" \
		--dir $(MIGRATIONS_DIR) \
		--dry-run

erd-web:
	@echo "Generating ERD diagram in browser..."
	atlas schema inspect --env gorm --web
