"use client";

import React, { useState, useEffect, useRef } from "react";

interface BezierControlPoint {
    x: number;
    y: number;
}

const BezierCurveEditor: React.FC = () => {
    const [controlPoints, setControlPoints] = useState<BezierControlPoint[]>([
        { x: 0.25, y: 0.75 },
        { x: 0.70, y: 0.18 },
    ]);
    const [copySuccess, setCopySuccess] = useState(false);
    const [animationStarted, setAnimationStarted] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [draggingPoint, setDraggingPoint] = useState<number | null>(null);

    useEffect(() => {
        const drawBezierCurve = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    const startPoint = { x: 0, y: canvas.height };
                    const endPoint = { x: canvas.width, y: 0 };
                    const cp1 = { x: controlPoints[0].x * canvas.width, y: (1 - controlPoints[0].y) * canvas.height };
                    const cp2 = { x: controlPoints[1].x * canvas.width, y: (1 - controlPoints[1].y) * canvas.height };

                    // Background
                    ctx.fillStyle = "#f3f4f6";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // Draw the Bezier curve
                    ctx.strokeStyle = "#1f2937";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPoint.x, endPoint.y);
                    ctx.stroke();

                    // Draw control points and lines
                    ctx.strokeStyle = "#9ca3af";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(cp1.x, cp1.y);
                    ctx.lineTo(cp2.x, cp2.y);
                    ctx.lineTo(endPoint.x, endPoint.y);
                    ctx.stroke();

                    // Draw control points
                    ctx.fillStyle = "#3b82f6";
                    ctx.strokeStyle = "#ffffff";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(cp1.x, cp1.y, 8, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.arc(cp2.x, cp2.y, 8, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();

                    // Draw the animated point moving along the curve
                    const t = animationProgress / 100;
                    const x = (1 - t) ** 3 * startPoint.x + 3 * (1 - t) ** 2 * t * cp1.x + 3 * (1 - t) * t ** 2 * cp2.x + t ** 3 * endPoint.x;
                    const y = (1 - t) ** 3 * startPoint.y + 3 * (1 - t) ** 2 * t * cp1.y + 3 * (1 - t) * t ** 2 * cp2.y + t ** 3 * endPoint.y;

                    ctx.fillStyle = "#ef4444";
                    ctx.beginPath();
                    ctx.arc(x, y, 6, 0, 2 * Math.PI);
                    ctx.fill();
                }
            }
        };

        drawBezierCurve();
    }, [controlPoints, animationProgress]);

    const handleControlPointChange = (index: number, axis: "x" | "y", value: number) => {
        const newControlPoints = [...controlPoints];
        newControlPoints[index][axis] = value;
        setControlPoints(newControlPoints);
    };

    const generateCSS = () => {
        const [p1, p2] = controlPoints;
        return `cubic-bezier(${p1.x}, ${p1.y}, ${p2.x}, ${p2.y})`;
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generateCSS()).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const startAnimation = () => {
        setAnimationStarted(true);
        setAnimationProgress(0); // Reset progress
    };

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const clickedPointIndex = controlPoints.findIndex(point => {
                const px = point.x * canvas.width;
                const py = (1 - point.y) * canvas.height;
                return Math.abs(x - px) < 10 && Math.abs(y - py) < 10;
            });

            if (clickedPointIndex !== -1) {
                setDraggingPoint(clickedPointIndex);
            }
        }
    };

    const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (draggingPoint !== null) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const x = (event.clientX - rect.left) / canvas.width;
                const y = 1 - (event.clientY - rect.top) / canvas.height;

                handleControlPointChange(draggingPoint, "x", Math.min(Math.max(x, 0), 1));
                handleControlPointChange(draggingPoint, "y", Math.min(Math.max(y, 0), 1));
            }
        }
    };

    const handleCanvasMouseUp = () => {
        setDraggingPoint(null);
    };

    const handleCanvasMouseLeave = () => {
        setDraggingPoint(null);
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center transition-colors duration-300 ease-in-out">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">
                    Bezier Curve Editor
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                    Customize cubic Bezier curves and copy the CSS code.
                </p>
            </header>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Control Points</h2>
                    <div className="flex flex-col space-y-4">
                        {controlPoints.map((point, index) => (
                            <div key={index} className="flex space-x-4 items-center">
                                <label htmlFor={`x-${index}`} className="text-gray-700 dark:text-gray-300">P{index + 1}</label>
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`x-${index}`} className="text-gray-700 dark:text-gray-300">X:</label>
                                        <input
                                            id={`x-${index}`}
                                            type="range"
                                            value={point.x * 100}
                                            min={0}
                                            max={100}
                                            aria-label={`Adjust X of P${index + 1}`}
                                            onChange={(e) => handleControlPointChange(index, "x", Number(e.target.value) / 100)}
                                            className="w-32 slider"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">{(point.x * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <label htmlFor={`y-${index}`} className="text-gray-700 dark:text-gray-300">Y:</label>
                                        <input
                                            id={`y-${index}`}
                                            type="range"
                                            value={point.y * 100}
                                            min={0}
                                            max={100}
                                            aria-label={`Adjust Y of P${index + 1}`}
                                            onChange={(e) => handleControlPointChange(index, "y", Number(e.target.value) / 100)}
                                            className="w-32 slider"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">{(point.y * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Bezier Curve Preview</h2>
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="border rounded-lg mb-4 cursor-pointer"
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseLeave}
                        aria-label="Bezier curve preview canvas"
                    ></canvas>
                    <textarea
                        readOnly
                        value={generateCSS()}
                        className="w-full border rounded p-2 bg-gray-100 text-black dark:bg-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300 ease-in-out"
                        rows={3}
                        style={{ resize: 'none' }}
                        aria-readonly="true"
                    />
                    <button
                        onClick={handleCopyToClipboard}
                        className="px-4 py-2 bg-black font-bold text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                        aria-live="polite"
                    >
                        {copySuccess ? "Copied!" : "Copy CSS"}
                    </button>
                </div>
            </div>

            <div className="w-full flex justify-center mt-10">
                <div
                    className={`w-16 h-16 bg-red-500 rounded-full ${animationStarted ? 'animate' : ''}`}
                    style={{
                        transform: `translateX(${animationProgress}%)`,
                        transition: `transform 5s cubic-bezier(${controlPoints[0].x}, ${controlPoints[0].y}, ${controlPoints[1].x}, ${controlPoints[1].y})`
                    }}
                    aria-label="Animated div following cubic-bezier path"
                ></div>
            </div>

            <button
                onClick={startAnimation}
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Start Animation
            </button>

            <style jsx>{`
                .animate {
                    animation: moveAcrossScreen 5s forwards cubic-bezier(${controlPoints[0].x}, ${controlPoints[0].y}, ${controlPoints[1].x}, ${controlPoints[1].y});
                }

                @keyframes moveAcrossScreen {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(calc(100vw - 4rem));
                    }
                }
            `}</style>
        </div>
    );
};

export default BezierCurveEditor;