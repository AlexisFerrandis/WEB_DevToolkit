"use client";

import React, { useState } from 'react';

const BoxShadowGenerator: React.FC = () => {
    const [offsetX, setOffsetX] = useState<number>(10);
    const [offsetY, setOffsetY] = useState<number>(10);
    const [blurRadius, setBlurRadius] = useState<number>(15);
    const [spreadRadius, setSpreadRadius] = useState<number>(0);
    const [shadowColor, setShadowColor] = useState<string>('#000000');
    const [shadowOpacity, setShadowOpacity] = useState<number>(0.5);
    const [inset, setInset] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopyToClipboard = () => {
        const boxShadowCSS = generateBoxShadowCSS();
        navigator.clipboard.writeText(`box-shadow: ${boxShadowCSS};`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateBoxShadowCSS = () => {
        const rgbaColor = hexToRgba(shadowColor, shadowOpacity);
        return `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgbaColor}`;
    };

    const hexToRgba = (hex: string, opacity: number) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Box Shadow Generator</h1>
                <p className="text-lg text-gray-600">
                    Customize your box-shadow and preview it in real-time.
                </p>
            </header>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shadow Parameters</h2>

                    <div className="mb-4">
                        <label className="text-gray-700">Offset X:</label>
                        <input
                            type="range"
                            value={offsetX}
                            min={-100}
                            max={100}
                            onChange={(e) => setOffsetX(Number(e.target.value))}
                            className="w-full slider"
                        />
                        <span className="text-gray-700">{offsetX}px</span>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Offset Y:</label>
                        <input
                            type="range"
                            value={offsetY}
                            min={-100}
                            max={100}
                            onChange={(e) => setOffsetY(Number(e.target.value))}
                            className="w-full slider"
                        />
                        <span className="text-gray-700">{offsetY}px</span>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Blur Radius:</label>
                        <input
                            type="range"
                            value={blurRadius}
                            min={0}
                            max={100}
                            onChange={(e) => setBlurRadius(Number(e.target.value))}
                            className="w-full slider"
                        />
                        <span className="text-gray-700">{blurRadius}px</span>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Spread Radius:</label>
                        <input
                            type="range"
                            value={spreadRadius}
                            min={-100}
                            max={100}
                            onChange={(e) => setSpreadRadius(Number(e.target.value))}
                            className="w-full slider"
                        />
                        <span className="text-gray-700">{spreadRadius}px</span>
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Shadow Color:</label>
                        <input
                            type="color"
                            value={shadowColor}
                            onChange={(e) => setShadowColor(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700">Shadow Opacity:</label>
                        <input
                            type="range"
                            value={shadowOpacity}
                            min={0}
                            max={1}
                            step={0.01}
                            onChange={(e) => setShadowOpacity(Number(e.target.value))}
                            className="w-full slider"
                        />
                        <span className="text-gray-700">{Math.round(shadowOpacity * 100)}%</span>
                    </div>

                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            checked={inset}
                            onChange={(e) => setInset(e.target.checked)}
                            className="checkbox"
                        />
                        <label className="text-gray-700 ml-2">Inset</label>
                    </div>
                </div>

                <div className="bg-gray-100 shadow-lg rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Preview & CSS Code</h2>

                    <div
                        id="box-shadow-preview"
                        className="w-full h-64 rounded-lg bg-gray-300 flex justify-center items-center mb-4"
                        style={{ boxShadow: generateBoxShadowCSS(), position: 'relative', zIndex: 10 }}
                    >
                        {/* <div className="w-32 h-32 bg-gray-400 rounded"></div> */}
                    </div>

                    <textarea
                        readOnly
                        value={`-webkit-box-shadow: ${generateBoxShadowCSS()};\nbox-shadow: ${generateBoxShadowCSS()};`}
                        className="w-full border rounded p-2 bg-gray-100 text-black mb-4"
                        rows={3}
                        style={{ resize: 'none', position: 'relative', zIndex: 5 }}
                    />

                    <div className="flex justify-between">
                        <button
                            onClick={handleCopyToClipboard}
                            className={`px-4 py-2 rounded shadow-md transition-colors bg-black text-white hover:bg-gray-800`}
                        >
                            {copied ? 'Copied!' : 'Copy CSS to Clipboard'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoxShadowGenerator;