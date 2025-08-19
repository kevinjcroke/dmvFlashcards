# DMV Practice Test Flashcards

An interactive web application for studying Missouri DMV permit test questions, created to help my son prepare for his driving permit exam.

## About This Project

When my son was getting ready to take his permit test, he asked for flashcards to help him study. Instead of traditional paper flashcards, I built this interactive web application that provides a more engaging way to practice DMV questions with immediate feedback and explanations.

## Features

- **Interactive Quiz Format**: Questions presented one at a time with multiple choice answers
- **Immediate Feedback**: Instant results showing whether answers are correct or incorrect
- **Detailed Explanations**: Each question includes an explanation to help reinforce learning
- **Progress Tracking**: Keep track of correct/incorrect answers and remaining questions
- **Comprehensive Question Bank**: Full set of Missouri DMV practice questions
- **Mobile Friendly**: Responsive design works on phones, tablets, and computers

## How to Use

### Online (GitHub Pages)
Visit the live application at: https://kevinjcroke.github.io/dmvFlashcards/

### Local Development
1. Clone this repository
2. Run a local web server (required for loading the JSON data):
   ```bash
   python -m http.server 8000
   ```
3. Open your browser to `http://localhost:8000`

## Study Resources

The `Resources` folder contains the official Missouri Driver Guide PDFs organized by chapter, providing comprehensive study material beyond just the flashcards.

## Technical Details

- **Frontend Only**: Pure HTML, CSS, and JavaScript - no backend required
- **Data Format**: Questions stored in JSON format for easy maintenance
- **CORS Friendly**: Designed to work with GitHub Pages hosting
- **No Dependencies**: Uses vanilla JavaScript for maximum compatibility

## Contributing

If you find errors in questions or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is created for educational purposes. DMV questions and content are based on official Missouri DMV materials.