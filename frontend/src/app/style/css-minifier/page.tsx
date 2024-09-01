"use client";

import React, { useState } from 'react';

const CSSMignifier: React.FC = () => {
    const [inputCSS, setInputCSS] = useState<string>('');
    const [minifiedCSS, setMinifiedCSS] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    const handleMinify = () => {
        const minified = inputCSS
            .replace(/\s+/g, ' ')
            .replace(/\s*{\s*/g, '{')
            .replace(/\s*}\s*/g, '}')
            .replace(/\s*;\s*/g, ';')
            .replace(/\s*:\s*/g, ':')
            .replace(/;}/g, '}');
        setMinifiedCSS(minified.trim());
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(minifiedCSS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Indique "Copied" pendant 2 secondes
    };

    const downloadCSSFile = () => {
        const blob = new Blob([minifiedCSS], { type: 'text/css' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'minified.css';
        link.click();
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">CSS Minifier</h1>
                <p className="text-lg text-gray-600">
                    Paste your CSS code below to minify it.
                </p>
            </header>

            <div className="w-full max-w-4xl">
                <textarea
                    value={inputCSS}
                    onChange={(e) => setInputCSS(e.target.value)}
                    className="w-full h-40 p-4 border rounded mb-4 bg-white text-black"
                    placeholder="Paste your CSS code here..."
                ></textarea>

                <button
                    onClick={handleMinify}
                    className="w-full py-2 mb-4 bg-black text-white rounded shadow-md hover:bg-gray-800 transition-colors"
                >
                    Minify CSS
                </button>

                <textarea
                    readOnly
                    value={minifiedCSS}
                    className="w-full h-40 p-4 border rounded mb-4 bg-gray-100 text-black"
                    placeholder="Minified CSS will appear here..."
                ></textarea>

                <div className="flex justify-between">
                    <button
                        onClick={handleCopyToClipboard}
                        className={`px-4 py-2 rounded shadow-md transition-colors bg-black text-white hover:bg-gray-800`}
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                        onClick={downloadCSSFile}
                        className="px-4 py-2 bg-black text-white rounded shadow-md hover:bg-gray-800 transition-colors"
                    >
                        Download as .css File
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CSSMignifier;