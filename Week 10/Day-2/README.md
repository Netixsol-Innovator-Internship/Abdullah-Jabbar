# Smart Healthcare Project

This project is a smart healthcare application that integrates advanced AI-driven features to assist users in finding and interacting with healthcare products. Key functionalities include product recommendations, user authentication, and seamless voice interactions through Text-to-Speech (TTS) and Speech-to-Text (STT) capabilities.

## Features

### Text-to-Speech (TTS) Functionality

The application includes a robust Text-to-Speech system that allows users to listen to AI-generated messages and product recommendations. The TTS feature is implemented using the Web Speech API and provides the following capabilities:

- **Play Mode**: Initiates speech synthesis for a given text message.
- **Pause Mode**: Temporarily halts the ongoing speech.
- **Resume Mode**: Continues playback from the paused point.
- **Stop/Reset to Initial**: Cancels the current speech and resets the system to its initial state.

#### Interactions

- **Single Click**: Toggles between play, pause, and resume states. If not playing, starts playback; if playing, pauses; if paused, resumes.
- **Double Click**: Stops the speech and resets to the initial state.

The TTS system ensures that only one instance of speech is active at a time across the application, preventing overlapping audio. It uses English (en-US) as the default language for synthesis.

### Speech-to-Text (STT) Functionality

The Speech-to-Text feature enables users to interact with the application using voice commands. Built on the Web Speech API, it transcribes spoken words into text for further processing by the AI system.

- **Continuous Listening**: Disabled to prevent indefinite listening; each session is discrete.
- **Interim Results**: Disabled to focus on final transcriptions only.
- **Language Support**: Set to English (en-US) for accurate recognition.
- **Error Handling**: Gracefully handles common errors like "no-speech" or "aborted" without disrupting the user experience.

This allows users to search for products or ask questions verbally, making the application more accessible.

### Additional Features

- **Product Recommendations**: AI-powered suggestions based on user queries.
- **User Authentication**: Secure login and signup with JWT-based authentication.
- **Responsive UI**: Built with Next.js and Tailwind CSS for a modern, mobile-friendly interface.
- **Data Processing**: Includes scripts for preprocessing healthcare product data from CSV files.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Netixsol-Innovator-Internship/Abdullah-Jabbar.git
   cd Week\ 9/Day-5-smart-healthcare
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the backend:

   ```bash
   cd backend
   pnpm install
   pnpm run build
   pnpm run start:prod
   ```

4. Set up the frontend:

   ```bash
   cd ../frontend
   pnpm install
   pnpm run dev
   ```

### Usage

- Access the application at `http://localhost:3000` (frontend).
- Use voice input to search for products or interact with the chatbot.
- Click on agent messages to hear them spoken aloud.

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, Node.js, TypeScript
- **Database**: MongoDB (via Mongoose)
- **AI**: Custom AI service for product recommendations
- **Voice APIs**: Web Speech API for TTS and STT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.