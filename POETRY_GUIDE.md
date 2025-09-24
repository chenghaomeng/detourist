# Poetry Development Guide

This guide explains how to use Poetry for dependency management in this project.

## 🎯 Why Poetry?

Poetry provides several advantages over traditional pip + requirements.txt:

- **Better dependency resolution** - Handles complex dependency conflicts
- **Lock file** - Ensures reproducible builds across environments
- **Virtual environment management** - Automatic venv creation and management
- **Project configuration** - Single `pyproject.toml` file for all project settings
- **Scripts** - Easy command execution with `poetry run`

## 📦 Project Configuration

The project uses `pyproject.toml` for configuration:

```toml
[tool.poetry]
name = "free-form-text-to-route"
version = "1.0.0"
description = "A web application that generates custom routes from natural language prompts"
authors = ["Your Team <team@example.com>"]
readme = "README.md"
packages = [{include = "backend"}]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.95.0"
# ... other dependencies

[tool.poetry.group.dev.dependencies]
pytest = "^7.3.2"
black = "^23.3.0"
# ... other dev dependencies

[tool.poetry.scripts]
start-backend = "uvicorn backend.api:app --reload"
start-backend-prod = "uvicorn backend.api:app --host 0.0.0.0 --port 8000"
```

## 🚀 Getting Started

### 1. Install Poetry

```bash
# macOS/Linux
curl -sSL https://install.python-poetry.org | python3 -

# Windows (PowerShell)
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -

# Verify installation
poetry --version
```

### 2. Install Dependencies

```bash
# Install all dependencies (including dev dependencies)
poetry install

# Install only production dependencies
poetry install --only=main

# Install without dev dependencies
poetry install --no-dev
```

### 3. Run Commands

```bash
# Run commands in Poetry environment
poetry run python -m uvicorn backend.api:app --reload
poetry run pytest
poetry run black backend/

# Use predefined scripts
poetry run start-backend
poetry run start-backend-prod

# Activate Poetry shell (optional)
poetry shell
# Now you can run commands directly without 'poetry run'
python -m uvicorn backend.api:app --reload
```

## 🔧 Common Commands

### Dependency Management

```bash
# Add new dependency
poetry add requests

# Add development dependency
poetry add --group dev pytest

# Add specific version
poetry add "fastapi>=0.95.0"

# Remove dependency
poetry remove package-name

# Update dependencies
poetry update

# Show dependency tree
poetry show --tree
```

### Project Management

```bash
# Show project info
poetry show

# Check for security vulnerabilities
poetry audit

# Export requirements.txt (if needed)
poetry export -f requirements.txt --output requirements.txt

# Build package
poetry build

# Publish package
poetry publish
```

### Environment Management

```bash
# Show virtual environment path
poetry env info

# Show virtual environment path only
poetry env info --path

# Remove virtual environment
poetry env remove python

# Create new virtual environment
poetry env use python3.11
```

## 🧪 Development Workflow

### 1. Adding New Dependencies

```bash
# Add a new package
poetry add package-name

# Add with specific version constraint
poetry add "package-name>=1.0.0,<2.0.0"

# Add development dependency
poetry add --group dev package-name
```

### 2. Running Tests

```bash
# Run all tests
poetry run pytest

# Run tests with coverage
poetry run pytest --cov=backend

# Run specific test file
poetry run pytest backend/tests/test_extraction.py
```

### 3. Code Quality

```bash
# Format code
poetry run black backend/

# Lint code
poetry run flake8 backend/

# Type checking
poetry run mypy backend/

# Run all quality checks
poetry run black backend/ && poetry run flake8 backend/ && poetry run mypy backend/
```

### 4. Running the Application

```bash
# Development server
poetry run start-backend

# Production server
poetry run start-backend-prod

# Custom command
poetry run python -m uvicorn backend.api:app --host 0.0.0.0 --port 8000
```

## 🔄 Team Collaboration

### 1. Sharing Dependencies

The `poetry.lock` file ensures all team members have identical dependencies:

```bash
# After adding new dependencies, commit both files:
git add pyproject.toml poetry.lock
git commit -m "Add new dependency: package-name"
```

### 2. Resolving Conflicts

If `poetry.lock` conflicts occur:

```bash
# Update lock file
poetry lock

# Or regenerate completely
rm poetry.lock
poetry install
```

### 3. Environment Consistency

```bash
# Check if environment matches lock file
poetry check

# Verify all dependencies are installed
poetry install --sync
```

## 🐳 Docker Integration

The Dockerfile is configured to use Poetry:

```dockerfile
# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="/root/.local/bin:$PATH"

# Configure Poetry
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --only=main --no-dev
```

## 🚨 Troubleshooting

### Common Issues

1. **Poetry not found**
   ```bash
   # Add to PATH
   export PATH="$HOME/.local/bin:$PATH"
   ```

2. **Virtual environment issues**
   ```bash
   # Remove and recreate
   poetry env remove python
   poetry install
   ```

3. **Dependency conflicts**
   ```bash
   # Update lock file
   poetry lock --no-update
   ```

4. **Slow installation**
   ```bash
   # Use faster resolver
   poetry config experimental.new-installer false
   ```

### Performance Tips

1. **Use Poetry shell** for interactive development:
   ```bash
   poetry shell
   # Now run commands directly
   ```

2. **Cache dependencies** in CI/CD:
   ```bash
   # Cache Poetry cache directory
   ~/.cache/pypoetry
   ```

3. **Parallel installation**:
   ```bash
   poetry config installer.parallel true
   ```

## 📚 Additional Resources

- [Poetry Documentation](https://python-poetry.org/docs/)
- [Poetry GitHub](https://github.com/python-poetry/poetry)
- [pyproject.toml Specification](https://packaging.python.org/en/latest/specifications/pyproject-toml/)

## 🔧 Configuration Files

The project includes several Poetry-related configurations:

- `pyproject.toml` - Main project configuration
- `poetry.lock` - Locked dependency versions (auto-generated)
- `.gitignore` - Excludes Poetry cache and virtual environments
- `Dockerfile.backend` - Docker configuration with Poetry
