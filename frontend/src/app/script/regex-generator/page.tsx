"use client";

import React, { useState } from 'react';
import InfoModal from './InfoModal';

const RegexCreator: React.FC = () => {
    const [inputPattern, setInputPattern] = useState<string>('');
    const [inputFlags, setInputFlags] = useState<string>('');
    const [testString, setTestString] = useState<string>('');
    const [generatedRegex, setGeneratedRegex] = useState<string>('');
    const [matchResult, setMatchResult] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const [activeButtons, setActiveButtons] = useState<string[]>([]);

    const handleGenerateRegex = () => {
        try {
            const regex = new RegExp(inputPattern, inputFlags);
            setGeneratedRegex(regex.source); // On garde uniquement le pattern sans les délimiteurs
            setMatchResult('');
        } catch (error) {
            setGeneratedRegex('Invalid Regex');
            setMatchResult('');
        }
    };

    const handleTestString = () => {
        try {
            const regex = new RegExp(generatedRegex, inputFlags); // On applique les flags ici aussi
            const result = regex.test(testString);
            setMatchResult(result ? "Match found!" : "No match found.");
        } catch (error) {
            setMatchResult('Error in testing string');
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(`/${generatedRegex}/${inputFlags}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Indique "Copied" pendant 2 secondes
    };

    const downloadRegexFile = () => {
        const blob = new Blob([`/${generatedRegex}/${inputFlags}`], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'regex.txt';
        link.click();
    };

    const addToPattern = (addition: string) => {
        if (activeButtons.includes(addition)) {
            setInputPattern(inputPattern.replace(addition, ''));
            setActiveButtons(activeButtons.filter((btn) => btn !== addition));
        } else {
            setInputPattern(inputPattern + addition);
            setActiveButtons([...activeButtons, addition]);
        }
    };

    const addToFlags = (flag: string) => {
        if (inputFlags.includes(flag)) {
            setInputFlags(inputFlags.replace(flag, ''));
        } else {
            setInputFlags(inputFlags + flag);
        }
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center transition-colors duration-300 ease-in-out">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">Regex Creator</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                    Create and test your regular expressions with ease.
                </p>
                <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500 transition-colors duration-300 ease-in-out"
                    onClick={() => setShowInfo(true)}
                >
                    <span className="inline-block w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 text-center leading-6">i</span>
                </button>
            </header>

            <div className="w-full max-w-4xl">
                <label className="block text-gray-700 dark:text-gray-300 mb-2">Regex Pattern</label>
                <input
                    value={inputPattern}
                    onChange={(e) => setInputPattern(e.target.value)}
                    className="w-full p-4 border rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-gray-100 transition-colors duration-300 ease-in-out"
                    placeholder="Enter or select your regex pattern..."
                />

                <div className="mb-4 flex flex-wrap gap-2">
                    {[
                        { label: 'Digit (\\d)', value: '\\d' },
                        { label: 'Word character (\\w)', value: '\\w' },
                        { label: 'Whitespace (\\s)', value: '\\s' },
                        { label: 'Lowercase letters [a-z]', value: '[a-z]' },
                        { label: 'Uppercase letters [A-Z]', value: '[A-Z]' },
                        { label: 'Digits [0-9]', value: '[0-9]' },
                        { label: 'Any character (.)', value: '.' },
                        { label: 'Start of string (^)', value: '^' },
                        { label: 'End of string ($)', value: '$' },
                        { label: 'Word boundary (\\b)', value: '\\b' },
                        { label: 'Non-word boundary (\\B)', value: '\\B' }
                    ].map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => addToPattern(btn.value)}
                            className={`px-3 py-1 rounded ${activeButtons.includes(btn.value)
                                ? 'bg-black text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100'
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <label className="block text-gray-700 dark:text-gray-300 mb-2">Regex Flags</label>
                <div className="mb-4 flex flex-wrap gap-2">
                    {[
                        { label: 'Global (g)', value: 'g' },
                        { label: 'Case-insensitive (i)', value: 'i' },
                        { label: 'Multiline (m)', value: 'm' },
                        { label: 'Sticky (y)', value: 'y' },
                        { label: 'Unicode (u)', value: 'u' }
                    ].map((btn) => (
                        <button
                            key={btn.value}
                            onClick={() => addToFlags(btn.value)}
                            className={`px-3 py-1 rounded ${inputFlags.includes(btn.value)
                                ? 'bg-black text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-100'
                                }`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleGenerateRegex}
                    className="w-full py-2 mb-4 font-bold bg-black text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                >
                    Generate Regex
                </button>

                <textarea
                    readOnly
                    value={`/${generatedRegex}/${inputFlags}`}
                    className="w-full h-20 p-4 border rounded mb-4 bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 transition-colors duration-300 ease-in-out"
                    placeholder="Generated regex will appear here..."
                ></textarea>

                <label className="block text-gray-700 dark:text-gray-300 mb-2">Test String</label>
                <input
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    className="w-full p-4 border rounded mb-4 bg-white dark:bg-gray-800 text-black dark:text-gray-100 transition-colors duration-300 ease-in-out"
                    placeholder="Enter string to test..."
                />

                <button
                    onClick={handleTestString}
                    className="w-full py-2 mb-4 font-bold bg-blue-500 text-white rounded shadow-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                >
                    Test String
                </button>

                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">{matchResult}</p>

                <div className="flex justify-between">
                    <button
                        onClick={handleCopyToClipboard}
                        className={`px-4 py-2 rounded font-bold shadow-md transition-colors bg-black text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300`}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={downloadRegexFile}
                        className="px-4 py-2 bg-black font-bold text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                    >
                        Download as .txt File
                    </button>
                </div>
            </div>

            <InfoModal show={showInfo} onClose={() => setShowInfo(false)} />
        </div>
    );
};

export default RegexCreator;