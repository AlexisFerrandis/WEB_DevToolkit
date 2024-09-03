import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { tools } from '../utils/tools';

const HomePage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 ease-in-out">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 z-10 transition-colors duration-300 ease-in-out">
                    DevToolkit
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 z-10 transition-colors duration-300 ease-in-out">
                    Your go-to collection of development tools.<br />
                    Select a category or a tool below.
                </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full px-4">
                {tools.map((category) => (
                    <div
                        key={category.name}
                        className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow transition-colors duration-300 ease-in-out z-10"
                    >
                        <Link href={category.path} className="flex flex-col items-center w-full">
                            <Image
                                src={category.icon}
                                alt={`${category.name} icon`}
                                width={64}
                                height={64}
                                className="mb-4"
                            />
                            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white text-center transition-colors duration-300 ease-in-out">
                                {category.name}
                            </h2>
                        </Link>
                        <ul className="w-full text-left mt-4">
                            {category.subcategories.slice(0, 4).map((subcategory) => (
                                <li key={subcategory.name} className="mb-2">
                                    <Link href={subcategory.path}>
                                        <span className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:underline transition-colors duration-300 ease-in-out">
                                            {subcategory.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                            {category.subcategories.length > 4 && (
                                <li className="mb-2">
                                    <span className="text-gray-700 dark:text-gray-300 transition-colors duration-300 ease-in-out">
                                        ...
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default HomePage;