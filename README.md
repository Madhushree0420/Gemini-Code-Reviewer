# Gemini Code Reviewer

An interactive, web-based tool that leverages the power of the Gemini API to provide expert code and image analysis. Get instant feedback on your code's quality, best practices, and potential bugs, or get design and architecture reviews for your UI mockups and diagrams.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- A modern web browser.
- A valid Gemini API key.

### Setup and Configuration

1.  **Clone the repository or download the files:**
    You will need `index.html`, `index.tsx`, and all other accompanying files and directories.

2.  **Set up your API Key:**
    This application requires a Gemini API key to function. The key must be available as an environment variable named `API_KEY`.

    How you set this depends on your hosting environment. For local development with a tool like Vite or Create React App, you would typically create a `.env.local` file in the root of your project:

    ```
    API_KEY=your_gemini_api_key_here
    ```
    
    *Note: The `process.env.API_KEY` is referenced in the code and must be properly configured in your deployment or development environment for the application to work.*

3.  **Running the Application:**
    Since this is a client-side application, you can run it by opening the `index.html` file in your browser. For the best experience and to avoid potential issues with modules, it's recommended to serve the files using a simple local web server.

    If you have Python installed, you can run:
    ```bash
    # For Python 3
    python -m http.server
    ```
    Then, navigate to `http://localhost:8000` in your browser.

## Features

-   **Expert Code Review**: Get detailed feedback on bugs, performance, best practices, and security vulnerabilities for a wide range of programming languages.
-   **Image Analysis**: Upload UI mockups, architecture diagrams, or even code screenshots for expert design and usability reviews.
-   **Predicted Output**: Understand what your code will do with an AI-generated prediction of its output or behavior.
-   **File Upload**: Easily load code or images from your local machine with a single click.
-   **Automatic Language Detection**: Upload a code file, and the tool will automatically detect and select the correct programming language for you.
-   **Light & Dark Mode**: Switch between themes for your comfort. Your preference is saved in `localStorage` for your next visit.
-   **Syntax Highlighting**: Code snippets in both the input and output are beautifully highlighted and include line numbers for maximum readability.
-   **Responsive Design**: A clean, modern, and responsive UI that works great on all screen sizes.

## How to Use

### Reviewing Code

1.  Select the programming language from the dropdown menu.
2.  Paste your code into the input area on the left, or click **Upload File** to load a code file from your computer.
3.  Click the **Review** button.
4.  The AI-generated feedback will stream into the output panel on the right. You can switch between the **Review** and **Predicted Output** tabs to see the full analysis.

### Reviewing an Image

1.  Click the **Upload Image** button and select an image file (e.g., a `.png` or `.jpg` of a UI design).
2.  The image preview will appear in the input panel.
3.  In the text area below the image, provide context or ask a specific question (e.g., "Please review this UI mockup for usability issues.").
4.  Click the **Review** button.
5.  The AI's design and architectural feedback will appear in the output panel.

## Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please feel free to open an issue or submit a pull request.
