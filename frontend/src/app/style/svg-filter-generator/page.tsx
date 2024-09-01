'use client';

import React, { useState, useCallback } from "react";

// Classe Color avec gestion stricte des types
class Color {
    r: number = 0;
    g: number = 0;
    b: number = 0;

    constructor(r: number, g: number, b: number) {
        this.set(r, g, b);
    }

    set(r: number, g: number, b: number) {
        this.r = this.clamp(r);
        this.g = this.clamp(g);
        this.b = this.clamp(b);
    }

    clamp(value: number): number {
        return Math.max(0, Math.min(255, value));
    }

    hueRotate(angle = 0) {
        angle = angle / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        this.multiply([
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072,
        ]);
    }

    grayscale(value = 1) {
        this.multiply([
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value),
        ]);
    }

    sepia(value = 1) {
        this.multiply([
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value),
        ]);
    }

    saturate(value = 1) {
        this.multiply([
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value,
        ]);
    }

    multiply(matrix: number[]) {
        const newR = this.clamp(this.r * matrix[0] + this.g * matrix[1] + this.b * matrix[2]);
        const newG = this.clamp(this.r * matrix[3] + this.g * matrix[4] + this.b * matrix[5]);
        const newB = this.clamp(this.r * matrix[6] + this.g * matrix[7] + this.b * matrix[8]);
        this.r = newR;
        this.g = newG;
        this.b = newB;
    }

    brightness(value = 1) {
        this.linear(value);
    }

    contrast(value = 1) {
        this.linear(value, -(0.5 * value) + 0.5);
    }

    linear(slope = 1, intercept = 0) {
        this.r = this.clamp(this.r * slope + intercept * 255);
        this.g = this.clamp(this.g * slope + intercept * 255);
        this.b = this.clamp(this.b * slope + intercept * 255);
    }

    invert(value = 1) {
        this.r = this.clamp((value + this.r / 255 * (1 - 2 * value)) * 255);
        this.g = this.clamp((value + this.g / 255 * (1 - 2 * value)) * 255);
        this.b = this.clamp((value + this.b / 255 * (1 - 2 * value)) * 255);
    }

    toString() {
        return `rgb(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)})`;
    }

    hsl() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h: number | undefined, s: number, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h = h ? h / 6 : 0;
        }

        return {
            h: h !== undefined ? h * 360 : 0, // Default to 0 if undefined
            s: s * 100,
            l: l * 100,
        };
    }
}

class Solver {
    target: Color;
    targetHSL: { h: number, s: number, l: number };
    reusedColor: Color;

    constructor(target: Color) {
        this.target = target;
        this.targetHSL = target.hsl();
        this.reusedColor = new Color(0, 0, 0);
    }

    solve(): { values: number[], loss: number, filter: string } {
        let result = this.solveNarrow(this.solveWide());

        while (result.loss > 30) {
            result = this.solveNarrow(this.solveWide());
        }

        return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values),
        };
    }

    solveWide(): { loss: number, values: number[] } {
        const A = 5;
        const c = 15;
        const a = [60, 180, 18000, 600, 1.2, 1.2];

        let best = { loss: Infinity, values: [] as number[] };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
                best = result;
            }
        }
        return best;
    }

    solveNarrow(wide: { loss: number, values: number[] }): { loss: number, values: number[] } {
        const A = wide.loss;
        const c = 2;
        const A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
        return this.spsa(A, a, c, wide.values, 500);
    }

    spsa(A: number, a: number[], c: number, values: number[], iters: number): { values: number[], loss: number } {
        const alpha = 1;
        const gamma = 0.16666666666666666;

        let best = values;
        let bestLoss = Infinity;
        const deltas = new Array(6);
        const highArgs = new Array(6);
        const lowArgs = new Array(6);

        for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, gamma);
            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = this.fix(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
                best = values.slice(0);
                bestLoss = loss;
            }
        }
        return { values: best, loss: bestLoss };
    }

    loss(filters: number[]): number {
        const color = this.reusedColor;
        color.set(0, 0, 0);

        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6);
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);

        const colorHSL = color.hsl();
        return (
            Math.abs(color.r - this.target.r) +
            Math.abs(color.g - this.target.g) +
            Math.abs(color.b - this.target.b) +
            Math.abs(colorHSL.h - this.targetHSL.h) +
            Math.abs(colorHSL.s - this.targetHSL.s) +
            Math.abs(colorHSL.l - this.targetHSL.l)
        );
    }

    css(filters: number[]): string {
        function fmt(idx: number, multiplier = 1): number {
            return Math.round(filters[idx] * multiplier);
        }
        return `brightness(0) saturate(100%) invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%)`;
    }

    fix(value: number, idx: number): number {
        let max = 100;
        if (idx === 2 /* saturate */) {
            max = 7500;
        } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
            max = 200;
        }

        if (idx === 3 /* hue-rotate */) {
            if (value > max) {
                value %= max;
            } else if (value < 0) {
                value = max + value % max;
            }
        } else if (value < 0) {
            value = 0;
        } else if (value > max) {
            value = max;
        }
        return value;
    }
}

function hexToRgb(hex: string): number[] | null {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ]
        : null;
}



const SVGFilterGenerator: React.FC = () => {
    const [targetColor, setTargetColor] = useState<string>("#00a4d6");
    const [computedFilter, setComputedFilter] = useState<string | null>(null);
    const [lossDetail, setLossDetail] = useState<string>("");
    const [notification, setNotification] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<boolean>(false);

    const handleComputeFilters = useCallback(() => {
        const rgb = hexToRgb(targetColor);
        if (rgb && rgb.length === 3) {
            const color = new Color(rgb[0], rgb[1], rgb[2]);
            const solver = new Solver(color);
            const result = solver.solve();

            setComputedFilter(result.filter);

            let lossMsg;
            if (result.loss < 1) {
                lossMsg = 'Perfect result, no visible difference.';
            } else if (result.loss < 5) {
                lossMsg = 'Result is very close to the target color.';
            } else if (result.loss < 15) {
                lossMsg = 'Acceptable result, with a slight difference.';
            } else {
                lossMsg = 'Result is off, consider trying again.';
            }
            setLossDetail(`${result.loss.toFixed(1)}\n${lossMsg}`);
            setNotification(null);
        } else {
            setNotification('Invalid HEX color format!');
        }
    }, [targetColor]);

    const handleCopyToClipboard = () => {
        if (computedFilter) {
            navigator.clipboard.writeText(computedFilter).then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            });
        }
    };

    return (
        <div className="relative p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">SVG Filter Generator</h1>
                <p className="text-lg text-gray-600">
                    Enter a HEX color to generate the corresponding CSS filter.
                </p>
            </header>
            <div className="w-full max-w-md mb-8">
                <input
                    type="text"
                    value={targetColor}
                    onChange={(e) => setTargetColor(e.target.value)}
                    placeholder="Enter target hex color"
                    className="w-full p-2 border rounded shadow-sm text-center text-black"
                />
                <button
                    onClick={handleComputeFilters}
                    className="mt-4 w-full px-6 py-2 bg-black text-white font-bold rounded shadow-md hover:bg-gray-800 transition-colors"
                >
                    Compute Filters
                </button>
            </div>
            {notification && (
                <div className="absolute top-4 right-4 p-4 bg-red-500 text-white rounded shadow-md">
                    {notification}
                </div>
            )}
            {computedFilter && (
                <div className="relative mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Computed CSS Filter</h2>
                    <div className="bg-gray-100 p-4 rounded-lg mb-6 shadow-sm relative">
                        <p className="font-mono text-sm text-gray-700">
                            filter: {computedFilter}
                        </p>
                        <button
                            onClick={handleCopyToClipboard}
                            className="absolute top-12 right-2 px-4 py-2 bg-black text-white font-bold rounded hover:bg-gray-800 transition-colors text-sm"
                        >
                            {copySuccess ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">
                        <span className="font-bold">Loss: {lossDetail}</span>
                        <br />
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex flex-col items-center">
                            <p className="text-md font-medium text-gray-800 mb-2">Real Pixel</p>
                            <div
                                className="w-24 h-24 rounded-full"
                                style={{ backgroundColor: targetColor }}
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-md font-medium text-gray-800 mb-2">Filtered Pixel</p>
                            <div
                                className="w-24 h-24 rounded-full"
                                style={{ backgroundColor: targetColor, filter: computedFilter }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SVGFilterGenerator;