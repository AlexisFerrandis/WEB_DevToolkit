const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 transition-colors duration-300 ease-in-out">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out">
                        © {new Date().getFullYear()} DevToolkit. Icons by <a href="https://icones8.fr/" rel="noopener" target="_blank" className="hover:underline">icones8</a>
                    </p>
                    <div className="space-x-4">
                        <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300 ease-in-out">Privacy Policy</a>
                        <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300 ease-in-out">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
export default Footer;