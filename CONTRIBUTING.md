# Contributing to Bfxr2 MCP Server

Thank you for your interest in contributing to the Bfxr2 MCP Server! This document provides guidelines for contributing to the project.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- A clear and descriptive title
- Detailed steps to reproduce the problem
- Expected behavior vs actual behavior
- Your environment (Node.js version, OS, MCP client used)
- Any relevant logs or error messages

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- A clear and descriptive title
- Detailed description of the proposed functionality
- Use cases and examples
- Any potential drawbacks or considerations

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the code style of the project
3. **Test your changes** thoroughly
4. **Update documentation** as needed
5. **Commit your changes** with clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

#### Pull Request Guidelines

- Keep changes focused and atomic
- Include tests for new functionality
- Update the README.md if needed
- Follow existing code style and conventions
- Write clear commit messages

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/bfxr2-mcp.git
cd bfxr2-mcp

# Install dependencies
npm install

# Run tests
npm test

# Start the development server
npm run dev
```

## Code Style

- Use ES modules (`import`/`export`)
- Follow existing naming conventions
- Write clear, self-documenting code
- Add comments for complex logic
- Keep functions focused and modular

## Testing

- Test all new features and bug fixes
- Ensure existing tests still pass
- Test with actual MCP clients when possible

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update examples if API changes

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

## Questions?

Feel free to open an issue for questions or discussion about contributions.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
