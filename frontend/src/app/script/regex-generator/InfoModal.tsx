import React from 'react';

interface InfoModalProps {
    show: boolean;
    onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">What is a Regex?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Common Patterns</h3>
                        <ul className="mb-4 text-gray-700 dark:text-gray-300">
                            <li><strong>\d</strong> : Matches any digit (0-9)</li>
                            <li><strong>\w</strong> : Matches any word character (alphanumeric + underscore)</li>
                            <li><strong>\s</strong> : Matches any whitespace character (spaces, tabs, etc.)</li>
                            <li><strong>[a-z]</strong> : Matches any lowercase letter</li>
                            <li><strong>[A-Z]</strong> : Matches any uppercase letter</li>
                            <li><strong>[0-9]</strong> : Matches any digit</li>
                        </ul>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Character Classes</h3>
                        <ul className="mb-4 text-gray-700 dark:text-gray-300">
                            <li><strong>.</strong> : any character except newline</li>
                            <li><strong>\W, \D, \S</strong> : not word, digit, whitespace</li>
                            <li><strong>[^abc]</strong> : not a, b, or c</li>
                            <li><strong>[a-g]</strong> : character between a & g</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Anchors & Quantifiers</h3>
                        <ul className="mb-4 text-gray-700 dark:text-gray-300">
                            <li><strong>^abc$</strong> : start / end of the string</li>
                            <li><strong>\\b, \\B</strong> : word, not-word boundary</li>
                            <li><strong>a&#42;, a&#43;, a&#63;</strong> : 0 or more, 1 or more, 0 or 1</li>
                            <li><strong>a&#123;5&#125;, a&#123;2,&#125;</strong> : exactly five, two or more</li>
                            <li><strong>a&#123;1,3&#125;</strong> : between one & three</li>
                            <li><strong>a&#43;&#63;, a&#123;2,&#125;&#63;</strong> : match as few as possible</li>
                        </ul>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Groups & Lookaround</h3>
                        <ul className="mb-4 text-gray-700 dark:text-gray-300">
                            <li><strong>(abc)</strong> : capture group</li>
                            <li><strong>\1</strong> : backreference to group #1</li>
                            <li><strong>(?:abc)</strong> : non-capturing group</li>
                            <li><strong>(?=abc)</strong> : positive lookahead</li>
                            <li><strong>(?!abc)</strong> : negative lookahead</li>
                        </ul>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-black font-bold text-white dark:bg-white dark:text-black rounded shadow-md hover:bg-gray-800 dark:hover:bg-gray-300 transition-colors duration-300 ease-in-out"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default InfoModal;