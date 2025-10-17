# Contributing to Space Station Safety Detection

First off, thank you for considering contributing to Space Station Safety Detection! It's people like you that make this project such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **Include mockups or examples if applicable**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Follow the code style** of the project
3. **Write clear commit messages**
4. **Include comments** in your code where necessary
5. **Test your changes** thoroughly
6. **Update documentation** if needed

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/space-station-detection.git
   cd space-station-detection
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. Make your changes and test them

5. Commit your changes:
   ```bash
   git add .
   git commit -m "Add your descriptive commit message"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Open a Pull Request

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Style Guide

- Use TypeScript for all new files
- Follow existing code formatting
- Use meaningful variable and function names
- Add type annotations where necessary
- Use interfaces for component props

### React Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types
- Add comments for complex logic

### CSS/Tailwind Guidelines

- Use Tailwind utility classes when possible
- Follow the existing color scheme
- Ensure responsive design
- Test on multiple screen sizes
- Use CSS variables for theme consistency

## Project Structure

```
components/          # React components
├── ui/             # Reusable UI components (shadcn/ui)
└── ...             # Feature-specific components
styles/             # Global styles and CSS
App.tsx             # Main application component
```

## Testing

- Test all new features thoroughly
- Ensure responsive design works on mobile and desktop
- Check browser compatibility
- Test with different image formats and sizes
- Verify localStorage functionality

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for complex functions
- Update inline comments for clarity
- Include examples in your PRs

## Questions?

Feel free to open an issue with the "question" label if you have any questions about contributing.

## Recognition

Contributors will be recognized in the project README and release notes.

Thank you for contributing! 🚀
