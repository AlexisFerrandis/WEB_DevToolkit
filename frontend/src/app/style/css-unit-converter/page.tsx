"use client";

import React, { useState } from "react";

const units = ["px", "rem", "em", "%", "vw", "vh"];

const UnitConverter: React.FC = () => {
    const [value, setValue] = useState<number>(16);
    const [fromUnit, setFromUnit] = useState<string>("px");
    const [baseSize, setBaseSize] = useState<number>(16);

    const convertValue = (toUnit: string): number => {
        if (fromUnit === toUnit) return value;

        let pxValue = value;
        switch (fromUnit) {
            case "rem":
            case "em":
                pxValue = value * baseSize;
                break;
            case "%":
                pxValue = (value / 100) * baseSize;
                break;
            case "vw":
                pxValue = (value / 100) * window.innerWidth;
                break;
            case "vh":
                pxValue = (value / 100) * window.innerHeight;
                break;
        }

        switch (toUnit) {
            case "rem":
            case "em":
                return pxValue / baseSize;
            case "%":
                return (pxValue / baseSize) * 100;
            case "vw":
                return (pxValue / window.innerWidth) * 100;
            case "vh":
                return (pxValue / window.innerHeight) * 100;
            case "px":
            default:
                return pxValue;
        }
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center transition-colors duration-300 ease-in-out">
            <header className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">CSS Unit Converter</h1>
                <p className="text-lg text-gray-900 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                    Convert between px, rem, em, %, vw, vh
                </p>
            </header>

            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-lg transition-colors duration-300 ease-in-out">
                <div className="mb-4">
                    <label htmlFor="value" className="block text-gray-900 dark:text-gray-300">Value:</label>
                    <input
                        id="value"
                        type="number"
                        value={value}
                        onChange={(e) => setValue(Number(e.target.value))}
                        className="w-full border rounded p-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="fromUnit" className="block text-gray-900 dark:text-gray-300">From:</label>
                    <select
                        id="fromUnit"
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value)}
                        className="w-full border rounded p-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    >
                        {units.map(unit => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="baseSize" className="block text-gray-900 dark:text-gray-300">Base Size (for rem/em):</label>
                    <input
                        id="baseSize"
                        type="number"
                        value={baseSize}
                        onChange={(e) => setBaseSize(Number(e.target.value))}
                        className="w-full border rounded p-2 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    />
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300 ease-in-out">Converted Values</h2>
                    <div className="space-y-2">
                        {units.map((unit) => (
                            <div key={unit} className="flex justify-between text-gray-900 dark:text-gray-300">
                                <span>{unit}:</span>
                                <span className="font-mono">{convertValue(unit).toFixed(2)} {unit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitConverter;