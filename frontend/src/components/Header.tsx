import Link from "next/link";
import dynamic from "next/dynamic";

const DarkModeToggle = dynamic(() => import("./DarkModeToggle"), { ssr: false });

const Header = () => {
    return (
        <header className="bg-gray-200 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10 transition-colors duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out">
                        DevToolkit
                    </Link>
                    <nav className="space-x-4 flex items-center transition-colors duration-300 ease-in-out">
                        <DarkModeToggle />
                        {['/style', '/script', '/images', '/api-tools', '/seo', '/database', '/miscellaneous'].map((path) => (
                            <Link href={path} key={path} className="text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 ease-in-out">
                                {path.replace('/', '')}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;