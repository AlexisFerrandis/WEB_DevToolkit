import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { tools } from '../utils/tools';

const HomePage = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-200">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">DevToolkit</h1>
                <p className="text-lg text-gray-600">
                    Your go-to collection of development tools.<br />
                    Select a category or a tool below.
                </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full px-4">
                {tools.map((category) => (
                    <div
                        key={category.name}
                        className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <Link href={category.path} className="flex flex-col items-center w-full">
                            <Image
                                src={category.icon}
                                alt={`${category.name} icon`}
                                width={64}
                                height={64}
                                className="mb-4"
                            />
                            <h2 className="text-2xl font-semibold mb-4 text-black text-center">
                                {category.name}
                            </h2>
                        </Link>
                        <ul className="w-full text-left mt-4">
                            {category.subcategories.slice(0, 4).map((subcategory) => (
                                <li key={subcategory.name} className="mb-2">
                                    <Link href={subcategory.path}>
                                        <span className="text-gray-700 hover:text-gray-900 hover:underline">
                                            {subcategory.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                            {category.subcategories.length > 4 && (
                                <li className="mb-2">
                                    <span className="text-gray-700">
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