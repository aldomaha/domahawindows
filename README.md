# DomahaWindow.js

A simple, modern, and customizable JavaScript library for creating beautiful modals, alerts, confirms, and multi-step wizards with zero dependencies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/domahawindows.svg)](https://badge.fury.io/js/domahawindows)

---

## Live Demo

See `DomahaWindow` in action on CodePen. Experiment with the code live in your browser!



## Features

-   **Zero Dependencies:** Built with Vanilla JavaScript, no jQuery required.
-   **Multi-Step Wizard:** Create sequences of modals for quizzes, guides, or forms.
-   **Highly Customizable:** Easily control colors, text, and buttons.
-   **Promise-Based:** Modern asynchronous flow for handling user input.
-   **Lightweight and Fast:** Optimized for performance.

## Installation

Install the package using your favorite package manager:

```bash
npm install domahawindows
```

## Quick Start

Import the library and its CSS into your project's main JavaScript file.

```javascript
import DomahaWindow from 'domahawindows';
import 'domahawindows/style.css';

// Create a multi-step wizard
const mySteps = [
    { title: 'Question 1', content: 'What is the capital of Saudi Arabia?' },
    { title: 'Question 2', content: 'What is the highest mountain in the world?' },
    { title: 'End', content: 'You have successfully completed the quiz!' }
];

DomahaWindow.wizard({ steps: mySteps });
```

## API and Customization

The `DomahaWindow.wizard(config)` method accepts a configuration object with the following properties:

### `steps` (Required)
An array of objects, where each object represents a step in the wizard.

-   `title` (string): The text that appears in the window's header.
-   `content` (string): The main text or question that appears in the window's body.

**Example:**
```javascript
const mySteps = [
  { title: 'Welcome', content: 'This is the first screen.' },
  { title: 'Goodbye', content: 'This is the last screen.' }
];
```

### `colors` (Optional)
An object to override the default color scheme.

-   `background` (string): The background of the modal content area. Can be a color or a CSS gradient.
-   `textColor` (string): The color of the main body text.
-   `titleColor` (string): The color of the header title.
-   `buttonBackground` (string): The background color of the navigation buttons.
-   `buttonTextColor` (string): The text color of the navigation buttons.

**Example:**
```javascript
DomahaWindow.wizard({
    steps: mySteps,
    colors: {
        background: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
        textColor: '#333',
        titleColor: '#111',
        buttonBackground: '#007bff',
        buttonTextColor: '#ffffff'
    }
});
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue on the [GitHub repository](https://github.com/your-username/domahawindows).

## License

This project is licensed under the **MIT License**.