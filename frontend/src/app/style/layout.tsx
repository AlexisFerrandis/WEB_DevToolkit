import React from 'react';
import Link from 'next/link';
import { tools } from '../../utils/tools';

const StyleLayout = ({ children }: { children: React.ReactNode }) => {

    const styleTools = tools.find(tool => tool.name === 'Style');

    return (
        <main className="flex flex-col items-center min-h-screen p-8 bg-gradient-to-b from-gray-50 to-gray-200">
            <header className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">Style Tools</h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl w-full px-4">
                <ul className="flex flex-col items-start space-y-4 list-inside pl-4">
                    {styleTools?.subcategories.map((subcategory) => (
                        <li key={subcategory.path} className="flex items-center text-gray-700 hover:text-gray-900">
                            <span className="w-2 h-2 bg-gray-700 rounded-full inline-block mr-3"></span>
                            <Link href={subcategory.path} className="hover:underline">
                                {subcategory.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-12 container mx-auto px-4">
                {children}
            </div>
        </main>
    );
};

export default StyleLayout;