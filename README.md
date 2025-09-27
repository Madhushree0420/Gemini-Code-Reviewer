# Gemini Code Reviewer

Ever wished you had an expert developer available 24/7 to look over your shoulder? Now you do.

Gemini Code Reviewer is your personal AI assistant for writing better code and designing better systems. Paste your code, upload a design, or even dictate your thoughts, and get instant, expert-level feedback on everything from bugs and performance to UI/UX best practices. It's like having a senior engineer on your team, ready whenever you are.

## Getting Up and Running

Getting started is a breeze. Here's how to get the reviewer working on your local machine.

### What You'll Need

*   A modern web browser that supports the Web Speech API (like Chrome or Edge for all features).
*   Your personal Gemini API key.

### Setup Steps

1.  **Get the Code:** Make sure you have all the project files, including `index.html`, on your computer.

2.  **Set Your API Key:** The application needs your Gemini API key to work its magic. This key should be set up as an environment variable called `API_KEY` in the environment where you're running the app.
    *   For example, if you're using a tool like Vite for local development, you'd create a file named `.env.local` in your project folder and add this line:
        ```
        API_KEY=your_gemini_api_key_goes_here
        ```
    *   *Important:* The application is built to look for this specific variable, so make sure it's set up correctly!

3.  **Launch the App:** You can open the `index.html` file directly in your browser. However, for the best experience, we recommend running a simple local web server. If you have Python installed, it's as easy as opening your terminal in the project folder and running:
    ```bash
    # For Python 3 users
    python -m http.server
    ```
    Then, just point your browser to `http://localhost:8000`.

## What's Inside? (Features)

This isn't just a simple code checker. Here's what makes it special:

-   🤖 **AI-Powered Code Reviews**: Get incredibly detailed feedback on potential bugs, performance bottlenecks, security risks, and ways to make your code more readable.
-   🎨 **Design & Diagram Analysis**: It's not just for code! Upload a UI mockup, an architecture diagram, or even a screenshot, and get an expert design review.
-   🎙️ **Voice-to-Code Dictation**: Use your microphone to dictate code or ask questions. The app transcribes your speech into text in real-time, perfect for hands-free brainstorming.
-   ⬆️ **Effortless Uploads**: Use the upload buttons to load code and image files directly from your computer.
-   🧠 **Smart Language Detection**: Don't worry about the dropdown. Upload a file, and we'll figure out if it's Python, JavaScript, or something else.
-   ✨ **Real-time Syntax Highlighting**: The code input area is a full-featured editor that highlights your code as you type, complete with line numbers and proper indentation.
-   📱 **Fully Responsive**: Works beautifully whether you're on a big monitor or a tablet.

## How to Use It

Ready to get your first review? It's simple.

### For Reviewing Code 👩‍💻

1.  **Pick your language** from the dropdown menu (or let the file upload do it for you).
2.  **Paste your code** into the editor, or click **Upload File**.
3.  Hit the **Review** button.
4.  Watch as the AI feedback streams in on the right!

### For Reviewing Images & Diagrams 🖼️

1.  Click the **Upload Image** button and choose your file.
2.  A preview will pop up. In the text box below it, **ask a question** or provide some context (e.g., "Can you suggest improvements for this login screen?").
3.  Hit the **Review** button.
4.  Get instant feedback on design, usability, and architecture.

### For Dictating with Audio 🎤

1.  Click the **Record Audio** button. Your browser will ask for microphone permission.
2.  Start speaking. Your words will be transcribed into the text area in real-time.
3.  Click **Stop Recording** when you're done.
4.  Hit the **Review** button to get feedback on your dictated text.

## Want to Contribute?

We love contributions! If you have an idea for a new feature, spot a bug, or want to improve something, feel free to open an issue or submit a pull request.
