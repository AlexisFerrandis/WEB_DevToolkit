"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import LoadingSpinner from '../../components/LoadingSpinner';

import { tools, ToolCategory } from '../../utils/tools';

const DatabaseLayout = ({ children }: { children: React.ReactNode }) => {
    const [databaseTools, setDatabaseTools] = useState<ToolCategory | undefined>(undefined);

    useEffect(() => {
        const loadedTools = tools.find(tool => tool.name === 'Database');
        setDatabaseTools(loadedTools);
    }, []);

    if (!databaseTools) {
        return <LoadingSpinner />;
    }
    return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-200">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Database Tools</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl w-full px-4">
                {databaseTools.subcategories.map((subcategory) => (
                    <div
                        key={subcategory.name}
                        className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <Link href={subcategory.path} className="flex flex-col items-center w-full">
                            <Image
                                src={subcategory.icon}
                                alt={subcategory.name}
                                width={48}
                                height={48}
                                className="mb-4"
                            />
                            <h2 className="text-xl font-semibold mb-2 text-black text-center">
                                {subcategory.name}
                            </h2>
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-12 container mx-auto px-4">
                {children}
            </div>
        </main>
    );
};

export default DatabaseLayout;