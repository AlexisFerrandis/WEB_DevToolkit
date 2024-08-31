"use client";

import React, { useState, useCallback } from "react";

type PaletteObject = {
    [key: string]: string;
};

const ColorPaletteGenerator: React.FC = () => {
    const [palette, setPalette] = useState<string[]>(generateRandomPalette());
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    function generateRandomPalette(): string[] {
        return Array.from({ length: 5 }, () => randomColor());
    }

    function randomColor(): string {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    const handleColorChange = useCallback((index: number, newColor: string) => {
        const newPalette = [...palette];
        newPalette[index] = newColor;
        setPalette(newPalette);
    }, [palette]);

    const handleColorSelection = useCallback((color: string) => {
        setSelectedColor(color);
    }, []);

    const handleExportJSON = useCallback(() => {
        const jsonContent: PaletteObject = palette.reduce((acc: PaletteObject, color, i) => {
            acc[`color-${i}`] = color;
            return acc;
        }, {});
        downloadFile(JSON.stringify(jsonContent, null, 2), 'json');
    }, [palette]);

    const handleExportSVG = useCallback(() => {
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">\n${palette.map((color, i) => `<rect fill="${color}" width="20%" height="100%" x="${i * 20}%" />`).join('\n')}\n</svg>`;
        downloadFile(svgContent, 'svg');
    }, [palette]);

    const handleExportCSS = useCallback(() => {
        const cssContent = `
/* CSS HEX */
${palette.map((color, i) => `--color-${i}: ${color};`).join('\n')}

/* CSS HSL */
${palette.map(color => `--color-hsl-${palette.indexOf(color)}: ${convertHexToHSL(color)};`).join('\n')}

/* SCSS HEX */
${palette.map((color, i) => `$color-${i}: ${color};`).join('\n')}

/* SCSS HSL */
${palette.map(color => `$color-hsl-${palette.indexOf(color)}: ${convertHexToHSL(color)};`).join('\n')}

/* SCSS RGB */
${palette.map(color => `$color-rgb-${palette.indexOf(color)}: ${convertHexToRGB(color)};`).join('\n')}
        `;
        downloadFile(cssContent, 'txt');
    }, [palette]);

    function downloadFile(content: string, format: string) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `palette.${format}`;
        link.click();
    }

    function convertHexToHSL(hex: string): string {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2;
        if (max !== min) {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        } else {
            s = 0;
        }
        return `hsla(${(h * 360).toFixed(1)}, ${(s * 100).toFixed(1)}%, ${(l * 100).toFixed(1)}%, 1)`;
    }

    function convertHexToRGB(hex: string): string {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    }

    const addColorToPalette = () => {
        setPalette([...palette, randomColor()]);
    };

    const removeColorFromPalette = (index: number) => {
        if (palette.length > 1) {
            setPalette(palette.filter((_, i) => i !== index));
        }
    };

    const primaryColor = palette[2] || '#000000';

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Color Palette Generator</h1>
                <p className="text-lg text-gray-600">
                    Click on a color to edit or copy it. Refresh to generate new colors.
                </p>
            </header>
            <button
                onClick={() => setPalette(generateRandomPalette())}
                className="mb-6 px-6 py-2 bg-black text-white font-bold rounded shadow-md hover:bg-gray-800 transition-colors"
            >
                Generate New Palette
            </button>
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {palette.map((color, index) => (
                    <div key={index} className="group relative cursor-pointer">
                        <div
                            className="w-full h-32 rounded-lg shadow-md"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorSelection(color)}
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={e => handleColorChange(index, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            title="Change color"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-white bg-opacity-80 text-gray-900 text-sm font-medium hidden group-hover:block rounded-b-lg shadow-lg">
                            {color}
                        </div>
                        <button
                            onClick={() => removeColorFromPalette(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs shadow-md hover:bg-red-600"
                        >
                            X
                        </button>
                    </div>
                ))}
                <button
                    onClick={addColorToPalette}
                    className="self-center px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-700 transition-colors"
                >
                    Add Color
                </button>
            </div>
            {selectedColor && (
                <div className="mt-6 p-4 bg-white rounded-lg shadow-lg text-lg">
                    <p>Selected Color: <span className="font-bold" style={{ color: selectedColor }}>{selectedColor}</span></p>
                    <button
                        onClick={() => navigator.clipboard.writeText(selectedColor)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow-md hover:bg-blue-700 transition-colors"
                    >
                        Copy to Clipboard
                    </button>
                </div>
            )}
            <div className="space-x-4 mt-8 flex">
                <button
                    onClick={handleExportJSON}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-md"
                    style={{ backgroundColor: primaryColor }}
                >
                    Download JSON
                </button>
                <button
                    onClick={handleExportSVG}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-md"
                    style={{ backgroundColor: primaryColor }}
                >
                    Download SVG
                </button>
                <button
                    onClick={handleExportCSS}
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded shadow-md"
                    style={{ backgroundColor: primaryColor }}
                >
                    Download CSS (as TXT)
                </button>
            </div>
        </div>
    );
};

export default ColorPaletteGenerator;