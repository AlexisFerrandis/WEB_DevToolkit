"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";

type TransformType = "translateX" | "translateY" | "rotate" | "scale" | "skewX" | "skewY";

interface Keyframe {
    percent: number;
    transforms: { type: TransformType, value: string }[];
}

const CSSAnimationDesigner: React.FC = () => {
    const [animationName, setAnimationName] = useState("exampleAnimation");
    const [duration, setDuration] = useState(2); // in seconds
    const [timingFunction, setTimingFunction] = useState("ease");
    const [delay, setDelay] = useState(0); // in seconds
    const [iterationCount, setIterationCount] = useState<"infinite" | number>(1);
    const [keyframes, setKeyframes] = useState<Keyframe[]>([
        { percent: 0, transforms: [{ type: "translateX", value: "0px" }] },
        { percent: 100, transforms: [{ type: "translateX", value: "100px" }] }
    ]);
    const [copySuccess, setCopySuccess] = useState(false);
    const previewRef = useRef<HTMLDivElement | null>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    const generateCSS = useCallback(() => {
        const keyframesCSS = keyframes
            .map(frame => {
                const transformsCSS = frame.transforms
                    .map(t => `${t.type}(${t.value})`)
                    .join(" ");
                return `    ${frame.percent}% { transform: ${transformsCSS}; }`;
            })
            .join("\n");

        return `
@keyframes ${animationName} {
${keyframesCSS}
}
        `;
    }, [animationName, keyframes]);

    const generateAnimationStyle = useCallback(() => {
        return `${animationName} ${duration}s ${timingFunction} ${delay}s ${iterationCount}`;
    }, [animationName, duration, timingFunction, delay, iterationCount]);

    useEffect(() => {
        const styleElement = document.createElement("style");
        styleRef.current = styleElement;
        document.head.appendChild(styleElement);

        return () => {
            if (styleRef.current) {
                document.head.removeChild(styleRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (styleRef.current) {
            styleRef.current.innerHTML = generateCSS();
        }
        if (previewRef.current) {
            previewRef.current.style.animation = generateAnimationStyle();
        }
    }, [generateCSS, generateAnimationStyle]);

    const handleTriggerAnimation = () => {
        if (previewRef.current) {
            previewRef.current.style.animation = 'none';
            void previewRef.current.offsetWidth; // Force reflow
            previewRef.current.style.animation = generateAnimationStyle();
        }
    };

    const handleKeyframeChange = (index: number, field: string, value: string | number) => {
        const newKeyframes = [...keyframes];
        newKeyframes[index] = { ...newKeyframes[index], [field]: value };
        setKeyframes(newKeyframes);
    };

    const handleTransformChange = (keyframeIndex: number, transformIndex: number, field: string, value: string) => {
        const newKeyframes = [...keyframes];
        const newTransforms = [...newKeyframes[keyframeIndex].transforms];
        newTransforms[transformIndex] = { ...newTransforms[transformIndex], [field]: value };
        newKeyframes[keyframeIndex] = { ...newKeyframes[keyframeIndex], transforms: newTransforms };
        setKeyframes(newKeyframes);
    };

    const addKeyframe = () => {
        setKeyframes([...keyframes, { percent: 50, transforms: [{ type: "translateX", value: "50px" }] }]);
    };

    const removeKeyframe = (index: number) => {
        if (keyframes.length > 2) {
            setKeyframes(keyframes.filter((_, i) => i !== index));
        }
    };

    const addTransform = (index: number) => {
        const newKeyframes = [...keyframes];
        newKeyframes[index].transforms.push({ type: "translateX", value: "0px" });
        setKeyframes(newKeyframes);
    };

    const removeTransform = (keyframeIndex: number, transformIndex: number) => {
        const newKeyframes = [...keyframes];
        if (newKeyframes[keyframeIndex].transforms.length > 1) {
            newKeyframes[keyframeIndex].transforms.splice(transformIndex, 1);
            setKeyframes(newKeyframes);
        }
    };

    const getUnitForTransform = (transformType: TransformType) => {
        switch (transformType) {
            case "translateX":
            case "translateY":
                return "px";
            case "rotate":
            case "skewX":
            case "skewY":
                return "deg";
            case "scale":
                return "";
            default:
                return "";
        }
    };

    const handleTransformTypeChange = (keyframeIndex: number, transformIndex: number, newType: TransformType) => {
        const newKeyframes = [...keyframes];
        const unit = getUnitForTransform(newType);
        newKeyframes[keyframeIndex].transforms[transformIndex] = { type: newType, value: unit ? `0${unit}` : "1" };
        setKeyframes(newKeyframes);
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generateCSS()).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center transition-colors duration-300 ease-in-out">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">
                    CSS Animation Designer
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                    Design your CSS animations visually and get the code instantly.
                </p>
            </header>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Animation Settings</h2>
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label htmlFor="animationName" className="text-gray-700 dark:text-gray-300">Animation Name:</label>
                            <input
                                id="animationName"
                                type="text"
                                value={animationName}
                                onChange={(e) => setAnimationName(e.target.value)}
                                className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="duration" className="text-gray-700 dark:text-gray-300">Duration (s):</label>
                            <input
                                id="duration"
                                type="number"
                                value={duration}
                                min={0.1}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="timingFunction" className="text-gray-700 dark:text-gray-300">Timing Function:</label>
                            <select
                                id="timingFunction"
                                value={timingFunction}
                                onChange={(e) => setTimingFunction(e.target.value)}
                                className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-300"
                            >
                                <option value="ease">Ease</option>
                                <option value="linear">Linear</option>
                                <option value="ease-in">Ease-In</option>
                                <option value="ease-out">Ease-Out</option>
                                <option value="ease-in-out">Ease-In-Out</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="delay" className="text-gray-700 dark:text-gray-300">Delay (s):</label>
                            <input
                                id="delay"
                                type="number"
                                value={delay}
                                min={0}
                                onChange={(e) => setDelay(Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-300"
                            />
                        </div>
                        <div>
                            <label htmlFor="iterationCount" className="text-gray-700 dark:text-gray-300">Iterations:</label>
                            <input
                                id="iterationCount"
                                type="number"
                                value={iterationCount !== "infinite" ? iterationCount : 1}
                                min={1}
                                onChange={(e) => setIterationCount(Number(e.target.value))}
                                className="border px-2 py-1 rounded w-full dark:bg-gray-700 dark:text-gray-300"
                            />
                            <label className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={iterationCount === "infinite"}
                                    onChange={(e) => setIterationCount(e.target.checked ? "infinite" : 1)}
                                    className="form-checkbox"
                                />
                                <span className="text-gray-700 dark:text-gray-300">Infinite</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-2">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Keyframes</h2>
                    <div className="flex flex-col space-y-4">
                        {keyframes.map((frame, keyframeIndex) => (
                            <div key={keyframeIndex} className="flex flex-col space-y-2">
                                <div className="flex space-x-4 items-center">
                                    <label className="text-gray-700 dark:text-gray-300">Percent:</label>
                                    <input
                                        type="number"
                                        value={frame.percent}
                                        min={0}
                                        max={100}
                                        onChange={(e) => handleKeyframeChange(keyframeIndex, "percent", Number(e.target.value))}
                                        className="border px-2 py-1 rounded w-24 dark:bg-gray-700 dark:text-gray-300"
                                    />
                                    <button
                                        onClick={() => removeKeyframe(keyframeIndex)}
                                        className="bg-red-500 text-white rounded px-2 py-1 shadow-md hover:bg-red-600 transition-colors duration-300 ease-in-out"
                                    >
                                        X
                                    </button>
                                </div>
                                <div className="flex flex-col space-y-2">
                                    {frame.transforms.map((transform, transformIndex) => (
                                        <div key={transformIndex} className="flex space-x-4 items-center">
                                            <select
                                                value={transform.type}
                                                onChange={(e) => handleTransformTypeChange(keyframeIndex, transformIndex, e.target.value as TransformType)}
                                                className="border px-2 py-1 rounded dark:bg-gray-700 dark:text-gray-300"
                                            >
                                                <option value="translateX">TranslateX</option>
                                                <option value="translateY">TranslateY</option>
                                                <option value="rotate">Rotate</option>
                                                <option value="scale">Scale</option>
                                                <option value="skewX">SkewX</option>
                                                <option value="skewY">SkewY</option>
                                            </select>
                                            <input
                                                type="text"
                                                value={transform.value}
                                                onChange={(e) => handleTransformChange(keyframeIndex, transformIndex, "value", e.target.value)}
                                                className="border px-2 py-1 rounded w-32 dark:bg-gray-700 dark:text-gray-300"
                                                placeholder={`e.g., ${getUnitForTransform(transform.type)}`}
                                            />
                                            <button
                                                onClick={() => removeTransform(keyframeIndex, transformIndex)}
                                                className="bg-red-500 text-white rounded px-2 py-1 shadow-md hover:bg-red-600 transition-colors duration-300 ease-in-out"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addTransform(keyframeIndex)}
                                        className="font-bold mt-2 px-4 py-1 bg-black text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                                    >
                                        + Transform
                                    </button>
                                </div>
                                {keyframeIndex < keyframes.length - 1 && <hr className="border-gray-300 my-4" />}
                            </div>
                        ))}
                        <button
                            onClick={addKeyframe}
                            className="font-bold mt-4 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                        >
                            + Keyframe
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-6 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Preview & CSS Code</h2>
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={handleTriggerAnimation}
                        className="px-4 py-2 bg-blue-600 font-bold text-white rounded shadow-md hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                    >
                        Trigger Animation
                    </button>
                </div>
                <div className="relative w-full h-64 bg-gray-100 rounded-lg shadow-lg mb-4">
                    <div
                        ref={previewRef}
                        className="absolute top-1/2 left-1/2 w-12 h-12 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    ></div>
                </div>
                <textarea
                    readOnly
                    value={`
                        /* Generated CSS */
                        ${generateCSS()}
                        `}
                    className="w-full border rounded p-2 bg-gray-100 text-black dark:bg-gray-700 dark:text-gray-100 mb-4 transition-colors duration-300 ease-in-out font-mono"
                    rows={10}
                    style={{ resize: 'none', whiteSpace: 'pre' }}
                />
                <div className="flex space-x-4">
                    <button
                        onClick={handleCopyToClipboard}
                        className="px-4 py-2 bg-black font-bold text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                    >
                        {copySuccess ? "Copied!" : "Copy CSS"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CSSAnimationDesigner;