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
```

Replace `YOUR_GEMINI_API_KEY` with your actual API key.

### Installation

Install the project dependencies:

```bash
bun install
```
# or
# npm install
# or
# yarn install
# or
# pnpm install

### Running the Development Server

First, run the development server:

```bash
bun dev
```
# or
# npm run dev
# or
# yarn dev
# or
# pnpm dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

