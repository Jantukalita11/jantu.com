# Contributing to Audio AI Studio

Thank you for your interest in contributing to Audio AI Studio! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to avoid duplicates
2. **Create a detailed bug report** including:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. **Check the roadmap** and existing feature requests
2. **Create a feature request** with:
   - Clear use case description
   - Expected behavior
   - Why this feature would be valuable
   - Potential implementation approach

### Pull Requests

1. **Fork the repository** and create a feature branch
2. **Follow coding standards**:
   - Use TypeScript
   - Follow existing code style
   - Write meaningful commit messages
   - Add tests for new features
   - Update documentation

3. **Commit message format**:
   ```
   type(scope): subject

   body

   footer
   ```
   
   Types: feat, fix, docs, style, refactor, test, chore

4. **Before submitting**:
   - Run linter: `npm run lint`
   - Run tests: `npm test`
   - Ensure all tests pass
   - Update documentation if needed

5. **Submit PR** with:
   - Clear title and description
   - Reference related issues
   - Screenshots for UI changes

## Development Setup

See [README.md](README.md) for setup instructions.

## Coding Standards

### TypeScript

- Use strict type checking
- Avoid `any` types when possible
- Use interfaces for object shapes
- Document complex types

### React/Next.js

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Implement proper error boundaries

### Backend

- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all inputs with Zod schemas
- Use parameterized queries

### Testing

- Write unit tests for business logic
- Write integration tests for API endpoints
- Aim for >80% code coverage
- Test error scenarios

### Documentation

- Document all public APIs
- Update README for new features
- Add inline comments for complex logic
- Keep documentation up to date

## Review Process

1. All PRs require at least one review
2. CI/CD must pass
3. Reviewers may request changes
4. Once approved, maintainers will merge

## Questions?

Feel free to ask questions in:
- GitHub Discussions
- Discord server
- Email: dev@audioaistudio.com

Thank you for contributing! 🎉
