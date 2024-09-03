"use client";

import React, { useState, useEffect } from 'react';

const CSSGridLayoutGenerator: React.FC = () => {
    const [columns, setColumns] = useState<number>(3);
    const [rows, setRows] = useState<number>(2);
    const [gap, setGap] = useState<number>(10);
    const [colTemplate, setColTemplate] = useState<string>('1fr 1fr 1fr');
    const [rowTemplate, setRowTemplate] = useState<string>('auto auto');
    const [copied, setCopied] = useState<boolean>(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [spans, setSpans] = useState<{ [key: number]: { colSpan: number, rowSpan: number } }>({});

    useEffect(() => {
        // Initialize spans for each cell to avoid undefined errors
        const initialSpans: { [key: number]: { colSpan: number, rowSpan: number } } = {};
        Array.from({ length: columns * rows }).forEach((_, i) => {
            initialSpans[i] = { colSpan: 1, rowSpan: 1 };
        });
        setSpans(initialSpans);
    }, [columns, rows]);

    const handleCopyToClipboard = () => {
        const gridCSS = generateGridCSS();
        navigator.clipboard.writeText(gridCSS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const generateGridCSS = () => {
        let css = `display: grid;\ngrid-template-columns: ${colTemplate};\ngrid-template-rows: ${rowTemplate};\ngap: ${gap}px;\n`;

        selectedItems.forEach((item) => {
            const { colSpan, rowSpan } = spans[item];
            css += `& > :nth-child(${item + 1}) {\n  grid-column: span ${colSpan};\n  grid-row: span ${rowSpan};\n}\n`;
        });

        return css;
    };

    const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cols = Number(e.target.value);
        setColumns(cols);
        setColTemplate(Array(cols).fill('1fr').join(' '));
    };

    const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rows = Number(e.target.value);
        setRows(rows);
        setRowTemplate(Array(rows).fill('auto').join(' '));
    };

    const handleGridItemClick = (index: number) => {
        if (selectedItems.includes(index)) {
            setSelectedItems(selectedItems.filter(item => item !== index));
        } else {
            setSelectedItems([...selectedItems, index]);
        }
    };

    const handleColSpanChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const colSpan = Number(e.target.value);
        setSpans({
            ...spans,
            [index]: { ...spans[index], colSpan },
        });
    };

    const handleRowSpanChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const rowSpan = Number(e.target.value);
        setSpans({
            ...spans,
            [index]: { ...spans[index], rowSpan },
        });
    };

    return (
        <div className="p-8 mb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center transition-colors duration-300 ease-in-out">
            <header className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300 ease-in-out">CSS Grid Layout Generator</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                    Customize your CSS Grid layout and preview it in real-time.
                </p>
            </header>

            <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 lg:col-span-1 transition-colors duration-300 ease-in-out">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Grid Parameters</h2>

                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300">Number of Columns:</label>
                        <input
                            type="number"
                            value={columns}
                            min={1}
                            max={12}
                            onChange={handleColumnsChange}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300">Number of Rows:</label>
                        <input
                            type="number"
                            value={rows}
                            min={1}
                            max={12}
                            onChange={handleRowsChange}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300">Gap (px):</label>
                        <input
                            type="number"
                            value={gap}
                            min={0}
                            max={50}
                            onChange={(e) => setGap(Number(e.target.value))}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300">Column Template:</label>
                        <input
                            type="text"
                            value={colTemplate}
                            onChange={(e) => setColTemplate(e.target.value)}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="e.g., 1fr 2fr 1fr"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 dark:text-gray-300">Row Template:</label>
                        <input
                            type="text"
                            value={rowTemplate}
                            onChange={(e) => setRowTemplate(e.target.value)}
                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                            placeholder="e.g., auto auto"
                        />
                    </div>

                    {selectedItems.length > 0 && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Selected Items</h2>
                            {selectedItems.map(index => (
                                <div key={index} className="mb-4">
                                    <h3 className="text-xl text-gray-800 dark:text-gray-100 mb-2">Item {index + 1}</h3>
                                    <div className="mb-2">
                                        <label className="text-gray-700 dark:text-gray-300">Column Span:</label>
                                        <input
                                            type="number"
                                            value={spans[index]?.colSpan || 1}
                                            min={1}
                                            max={columns}
                                            onChange={(e) => handleColSpanChange(e, index)}
                                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-gray-700 dark:text-gray-300">Row Span:</label>
                                        <input
                                            type="number"
                                            value={spans[index]?.rowSpan || 1}
                                            min={1}
                                            max={rows}
                                            onChange={(e) => handleRowSpanChange(e, index)}
                                            className="w-full border rounded p-2 dark:bg-gray-700 dark:text-gray-100"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg p-6 lg:col-span-2 transition-colors duration-300 ease-in-out">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Preview & CSS Code</h2>

                    <div
                        id="grid-preview"
                        className="w-full h-64 bg-gray-200 dark:bg-gray-600 grid"
                        style={{
                            gridTemplateColumns: colTemplate,
                            gridTemplateRows: rowTemplate,
                            gap: `${gap}px`,
                        }}
                    >
                        {Array.from({ length: columns * rows }).map((_, i) => (
                            <div
                                key={i}
                                className={`bg-gray-300 dark:bg-gray-500 flex justify-center items-center text-black dark:text-gray-100 cursor-pointer ${selectedItems.includes(i) ? 'ring-4 ring-blue-300' : ''}`}
                                style={{
                                    gridColumn: spans[i]?.colSpan ? `span ${spans[i].colSpan}` : undefined,
                                    gridRow: spans[i]?.rowSpan ? `span ${spans[i].rowSpan}` : undefined,
                                    border: '1px solid #ccc',
                                }}
                                onClick={() => handleGridItemClick(i)}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <textarea
                        readOnly
                        value={generateGridCSS()}
                        className="w-full border rounded p-2 bg-gray-100 dark:bg-gray-800 text-black dark:text-gray-100 mt-4 transition-colors duration-300 ease-in-out"
                        rows={5}
                        style={{ resize: 'none' }}
                    />

                    <div className="flex justify-between mt-4">
                        <button
                            onClick={handleCopyToClipboard}
                            className={`px-4 py-2 rounded shadow-md transition-colors bg-black font-bold text-white dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-300`}
                        >
                            {copied ? 'Copied!' : 'Copy CSS to Clipboard'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CSSGridLayoutGenerator;