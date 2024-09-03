"use client";

import React, { useState, useCallback, useRef } from "react";

type GradientType = "linear" | "radial" | "conic";

interface GradientStop {
    color: string;
    position: number;
}

const GradientGenerator: React.FC = () => {
    const [gradientType, setGradientType] = useState<GradientType>("linear");
    const [gradientStops, setGradientStops] = useState<GradientStop[]>([
        { color: "#ff7f50", position: 0 },
        { color: "#87cefa", position: 50 },
        { color: "#dda0dd", position: 100 },
    ]);
    const [angle, setAngle] = useState(90);
    const [radialShape, setRadialShape] = useState<"circle" | "ellipse">("circle");
    const [ellipsePosition, setEllipsePosition] = useState(50);
    const [shapeHeightIntensity, setShapeHeightIntensity] = useState(50);
    const [copySuccess, setCopySuccess] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const handleColorChange = useCallback((index: number, color: string) => {
        const newStops = [...gradientStops];
        newStops[index].color = color;
        setGradientStops(newStops);
    }, [gradientStops]);

    const handlePositionChange = useCallback((index: number, position: number) => {
        const newStops = [...gradientStops];
        newStops[index].position = position;
        setGradientStops(newStops);
    }, [gradientStops]);

    const addColorStop = () => {
        setGradientStops([...gradientStops, { color: "#ffffff", position: 100 }]);
    };

    const removeColorStop = (index: number) => {
        if (gradientStops.length > 2) {
            setGradientStops(gradientStops.filter((_, i) => i !== index));
        }
    };

    const generateCSS = () => {
        const colorStops = gradientStops
            .map(stop => `${stop.color} ${stop.position}%`)
            .join(", ");

        if (gradientType === "linear") {
            return `linear-gradient(${angle}deg, ${colorStops})`;
        } else if (gradientType === "radial") {
            if (radialShape === "circle") {
                return `radial-gradient(circle at ${ellipsePosition}% ${shapeHeightIntensity}%, ${colorStops})`;
            } else {
                return `radial-gradient(ellipse at ${ellipsePosition}% ${shapeHeightIntensity}%, ${colorStops})`;
            }
        } else if (gradientType === "conic") {
            return `conic-gradient(from ${angle}deg, ${colorStops})`;
        } else {
            return "";
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generateCSS()).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                const width = canvas.width;
                const height = canvas.height;
                let gradient;
                if (gradientType === "linear") {
                    gradient = ctx.createLinearGradient(0, 0, width, 0);
                } else if (gradientType === "radial") {
                    const radius = Math.min(width, height) / 2 * (shapeHeightIntensity / 100);
                    gradient = ctx.createRadialGradient(
                        (width / 2) * (ellipsePosition / 100), height / 2, 0,
                        width / 2, height / 2, radius
                    );
                } else {
                    gradient = ctx.createConicGradient(
                        angle * (Math.PI / 180),
                        width / 2, height / 2
                    );
                }

                gradientStops.forEach(stop => {
                    gradient.addColorStop(stop.position / 100, stop.color);
                });

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, width, height);

                const link = document.createElement('a');
                link.download = 'gradient.png';
                link.href = canvas.toDataURL();
                link.click();
            }
        }
    };

    const handlePreviewInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;

        const closestIndex = gradientStops.reduce((prevIndex, stop, index) => {
            return Math.abs(stop.position - percentage) < Math.abs(gradientStops[prevIndex].position - percentage) ? index : prevIndex;
        }, 0);

        const updatedStops = [...gradientStops];
        updatedStops[closestIndex].position = Math.round(percentage);
        setGradientStops(updatedStops);
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center transition-colors duration-300 ease-in-out">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">
                    Gradient Generator
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                    Create beautiful gradients and copy the CSS code.
                </p>
            </header>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Gradient Type</h2>
                    <div className="flex space-x-4 justify-center">
                        <button
                            onClick={() => setGradientType("linear")}
                            className={`px-4 py-2 rounded font-bold ${gradientType === "linear" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                        >
                            Linear
                        </button>
                        <button
                            onClick={() => setGradientType("radial")}
                            className={`px-4 py-2 rounded font-bold ${gradientType === "radial" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                        >
                            Radial
                        </button>
                        <button
                            onClick={() => setGradientType("conic")}
                            className={`px-4 py-2 rounded font-bold ${gradientType === "conic" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}
                        >
                            Conic
                        </button>
                    </div>
                    {gradientType === "radial" && (
                        <>
                            <div className="flex justify-center space-x-4 mt-4">
                                <label htmlFor="radialShape" className="text-gray-700 dark:text-gray-300">Shape:</label>
                                <select
                                    id="radialShape"
                                    value={radialShape}
                                    onChange={(e) => setRadialShape(e.target.value as "circle" | "ellipse")}
                                    className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300"
                                >
                                    <option value="circle">Circle</option>
                                    <option value="ellipse">Ellipse</option>
                                </select>
                            </div>
                            <div className="flex justify-center space-x-2 mt-4">
                                <label htmlFor="ellipsePosition" className="text-gray-700 dark:text-gray-300">Position:</label>
                                <input
                                    id="ellipsePosition"
                                    type="range"
                                    value={ellipsePosition}
                                    min={0}
                                    max={100}
                                    onChange={(e) => setEllipsePosition(Number(e.target.value))}
                                    className="w-32 slider"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{ellipsePosition}%</span>
                            </div>
                            <div className="flex justify-center space-x-2 mt-4">
                                <label htmlFor="shapeHeightIntensity" className="text-gray-700 dark:text-gray-300">Height:</label>
                                <input
                                    id="shapeHeightIntensity"
                                    type="range"
                                    value={shapeHeightIntensity}
                                    min={0}
                                    max={100}
                                    onChange={(e) => setShapeHeightIntensity(Number(e.target.value))}
                                    className="w-32 slider"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{shapeHeightIntensity}%</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Gradient Colors</h2>
                    <div className="flex flex-col space-y-4">
                        {gradientStops.map((stop, index) => (
                            <div key={index} className="flex space-x-4 items-center">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={stop.color}
                                        onChange={(e) => handleColorChange(index, e.target.value)}
                                        className="w-16 h-8 cursor-pointer"
                                    />
                                </div>
                                <input
                                    type="range"
                                    value={stop.position}
                                    min={0}
                                    max={100}
                                    onChange={(e) => handlePositionChange(index, Number(e.target.value))}
                                    className="w-32 slider"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{stop.position}%</span>
                                <button
                                    onClick={() => removeColorStop(index)}
                                    className="bg-red-500 text-white rounded px-2 py-1 shadow-md hover:bg-red-600 transition-colors duration-300 ease-in-out"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addColorStop}
                        className="self-center font-bold mt-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                    >
                        Add Color Stop
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-6 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Preview & CSS Code</h2>
                <div
                    id="gradient-preview"
                    className="w-full h-64 rounded-lg shadow-lg cursor-pointer mb-4"
                    style={{ background: generateCSS() }}
                    onClick={handlePreviewInteraction}
                ></div>
                <textarea
                    readOnly
                    value={generateCSS()}
                    className="w-full border rounded p-2 bg-gray-100 text-black dark:bg-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300 ease-in-out"
                    rows={3}
                    style={{ resize: 'none' }}
                />
                <div className="flex space-x-4">
                    <button
                        onClick={handleCopyToClipboard}
                        className="px-4 py-2 bg-black font-bold text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                    >
                        {copySuccess ? "Copied!" : "Copy CSS"}
                    </button>
                    <button
                        onClick={downloadImage}
                        className="px-4 py-2 bg-black font-bold text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                    >
                        Download as PNG
                    </button>
                </div>
            </div>

            <canvas ref={canvasRef} width={800} height={600} className="hidden"></canvas>
        </div>
    );
};

export default GradientGenerator;