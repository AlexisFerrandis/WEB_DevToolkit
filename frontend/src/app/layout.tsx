import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.scss";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "DevToolkit - Your Web Development Tools",
    description: "WebDev Toolkit: A comprehensive all-in-one platform for web developers, featuring essential tools like CSS management, image optimization, JavaScript enhancement, API testing, and SEO analysis, designed to boost productivity and streamline your workflow.",
    icons: {
        icon: '/favicon.ico',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen transition-colors duration-300 ease-in-out">
                <Header />
                <div className="flex-grow">{children}</div>
                <Footer />
            </body>
        </html>
    );
}