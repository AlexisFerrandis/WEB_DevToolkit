const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} DevToolkit. All rights reserved.
                    </p>
                    <div className="space-x-4">
                        <a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;