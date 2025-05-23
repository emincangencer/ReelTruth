# Reel Truth

Reel Truth is a web application that analyses YouTube videos and shorts using Youtube URL. It extracts factual claims from the video content and evaluates their truthfulness and reasonableness based on AI analysis.

## Getting Started

To run this project locally, you will need:

- Node.js (v18 or later)
- A Gemini API key.

### Environment Variables

Create a `.env.local` file in the root of the project and add your Gemini API key:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_EXTRACT_MODEL=model_with_video_understanding
GEMINI_EVALUATE_MODEL=model_with_video_understanding
```

Replace `YOUR_GEMINI_API_KEY` with your actual API key.

### Installation

Install the project dependencies:

```bash
bun install
```

### Running the Development Server

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

