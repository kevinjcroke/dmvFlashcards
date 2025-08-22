# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DMV Practice Test Flashcards is a pure frontend web application for studying Missouri DMV permit test questions. It uses vanilla HTML, CSS, and JavaScript with no build process or dependencies.

## Architecture

### Core Components
- **FlashcardApp class** (`app.js`): Main application logic managing quiz flow, scoring, and persistence
- **Screen-based UI**: Multiple screens (welcome, loading, question, result, complete, error) controlled by `showScreen()`
- **Question Data**: JSON format with `id`, `question`, `options` (a-d), `correct_answer`, and `explanation` fields
- **Local Storage**: Saves progress including question scores, mastery status, and total correct/incorrect counts

### Key Data Flow
1. App loads `complete_flashcards.json` via `loadFlashcardsJSON()`
2. Questions filtered by `getAvailableQuestions()` to exclude mastered ones
3. Mastery logic: question removed when `correct >= incorrect + 2`
4. Inline results displayed immediately after answer selection (no separate result screen)

### State Management
- `questionScores[id]`: Tracks correct/incorrect counts and mastery status per question
- `totalCorrect/totalIncorrect`: Global statistics
- Progress persisted to localStorage as `dmv-flashcards-progress`

## Development Commands

**Local server** (required for JSON loading):
```bash
python -m http.server 3000
# Then open http://localhost:3000
```

**Files to modify:**
- `complete_flashcards.json`: Main question bank (44 questions)
- `app.js`: Application logic
- `index.html`: UI structure with audio player iframe
- `styles.css`: Styling including responsive design

## Commit Message Guidelines

Base commit messages only on actual staged changes in `git diff --staged`. Do not include previous commits or assumptions.