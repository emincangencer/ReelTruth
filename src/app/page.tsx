"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import ISO6391 from 'iso-639-1';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Home() {
  const [url, setUrl] = useState('');
  const [language, setLanguage] = useState('en');
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Generate language options from iso-639-1, displaying names in English
  const languageOptions = ISO6391.getAllCodes()
    .map(code => ({
      value: code,
      label: ISO6391.getName(code) || code, // Use English name, fallback to code
    }));

  const handleAnalyze = async () => {
    setError('');
    setAnalysisResult('');
    setLoading(true);
    setError(''); // Clear previous errors
    setAnalysisResult(''); // Clear previous results

    // Basic validation for YouTube URL format
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(url)) {
      setError('Please enter a valid YouTube URL.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Use the error message from the API response if available, otherwise a generic message
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setAnalysisResult(result.analysis);

    } catch (err: unknown) {
      console.error("Analysis error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Reel Truth Analyzer</h1>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <Input
            id="url-input"
            type="text"
            className="flex-grow"
            placeholder="Enter YouTube URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Select onValueChange={setLanguage} value={language}>
            <SelectTrigger id="language-select" className="w-[180px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAnalyze}
            disabled={!url || loading}
            className="w-full md:w-auto"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {error && <div className="text-red-500 mt-4">Error: {error}</div>}

        {analysisResult && (
          <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-800 w-full">
            <h2 className="text-xl font-semibold mb-2">Analysis Result:</h2>
            <ReactMarkdown>{analysisResult}</ReactMarkdown>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 Reel Truth Analyzer. All rights reserved.</p>
      </footer>
    </div>
  );
}
