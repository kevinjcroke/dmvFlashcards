# Claude Rules for DMV Flashcards Project

## Commit Message Guidelines

When creating commit messages, focus only on the actual staged changes visible in `git diff --staged`. Do not include:
- Changes that were made in previous commits
- Future planned changes
- Assumptions about what might have been modified

Always base commit descriptions strictly on the current diff output.

## Development Commands

- **Local server**: `python -m http.server 3000` then open `http://localhost:3000`
- **Test/build**: Check for any npm scripts or testing commands in package.json