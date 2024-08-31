import Link from "next/link";

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                        DevToolkit
                    </Link>
                    <nav className="space-x-4">
                        {/* <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link> */}
                        <Link href="/style" className="text-gray-600 hover:text-gray-900">
                            Style
                        </Link>
                        <Link href="/script" className="text-gray-600 hover:text-gray-900">
                            Script
                        </Link>
                        <Link href="/images" className="text-gray-600 hover:text-gray-900">
                            Images
                        </Link>
                        <Link href="/api-tools" className="text-gray-600 hover:text-gray-900">
                            API
                        </Link>
                        <Link href="/seo" className="text-gray-600 hover:text-gray-900">
                            SEO
                        </Link>
                        <Link href="/database" className="text-gray-600 hover:text-gray-900">
                            Database
                        </Link>
                        <Link href="/miscellaneous" className="text-gray-600 hover:text-gray-900">
                            Misc
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;