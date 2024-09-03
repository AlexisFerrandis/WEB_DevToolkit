export interface ToolSubcategory {
    name: string;
    path: string;
    icon: string;
}

export interface ToolCategory {
    name: string;
    subcategories: ToolSubcategory[];
    icon: string;
    path: string;
}

export const tools: ToolCategory[] = [
    {
        name: "Style",
        subcategories: [
            { name: "Color Palette Generator", path: "/style/color-palette-generator", icon: "/assets/icons/color-palette-generator-icon.png" },
            { name: "Gradient Generator", path: "/style/gradient-generator", icon: "/assets/icons/gradient-generator-icon.png" },
            { name: "SVG Filter Interpreter", path: "/style/svg-filter-generator", icon: "/assets/icons/svg-filter-generator.png" },
            { name: "Box Shadow", path: "/style/box-shadow-generator", icon: "/assets/icons/box-shadow-generator.png" },
            { name: "CSS Minifier", path: "/style/css-minifier", icon: "/assets/icons/css-minifier-icon.png" },
            { name: "Text Shadow", path: "/style/text-shadow-generator", icon: "/assets/icons/text-shadow-generator.png" },
            { name: "CSS Unit Converter", path: "/style/css-unit-converter", icon: "/assets/icons/css-unity-converter.png" },
            { name: "Grid Interpreter", path: "/style/grid-interpreter", icon: "/assets/icons/grid-interpreter.png" },
            { name: "Custom Bezier Curves", path: "/style/custom-bezier-curves", icon: "/assets/icons/custom-bezier-curves.png" },
            { name: "Animation Designer", path: "/style/animation-designer", icon: "/assets/icons/animation-designer.png" },
        ],
        icon: "/assets/icons/style-icon.png",
        path: "/style",
    },
    {
        name: "Script",
        subcategories: [
            { name: "JavaScript Minifier", path: "/script/javascript-minifier", icon: "/assets/icons/javascript-minifier-icon.png" },
            { name: "JavaScript Formatter", path: "/script/javascript-formatter", icon: "/assets/icons/javascript-formatter-icon.png" },
            { name: "Regex Generator", path: "/script/regex-generator", icon: "/assets/icons/regex-generator-icon.png" },
        ],
        icon: "/assets/icons/script-icon.png",
        path: "/script",
    },
    {
        name: "Images",
        subcategories: [
            { name: "Image Compressor", path: "/images/image-compressor", icon: "/assets/icons/image-compressor-icon.png" },
            { name: "Sprite Generator", path: "/images/sprite-generator", icon: "/assets/icons/sprite-generator-icon.png" },
            { name: "Image Format Converter", path: "/images/image-format-converter", icon: "/assets/icons/image-format-converter-icon.png" },
        ],
        icon: "/assets/icons/images-icon.png",
        path: "/images",
    },
    {
        name: "API Tools",
        subcategories: [
            { name: "API Tester", path: "/api-tools/api-tester", icon: "/assets/icons/api-tester-icon.png" },
        ],
        icon: "/assets/icons/api-tools-icon.png",
        path: "/api-tools",
    },
    {
        name: "SEO",
        subcategories: [
            { name: "Link Preview", path: "/seo/link-preview", icon: "/assets/icons/link-preview-icon.png" },
        ],
        icon: "/assets/icons/seo-icon.png",
        path: "/seo",
    },
    {
        name: "Database",
        subcategories: [
            { name: "Query Generator", path: "/database/query-generator", icon: "/assets/icons/query-generator-icon.png" },
        ],
        icon: "/assets/icons/database-icon.png",
        path: "/database",
    },
    {
        name: "Miscellaneous",
        subcategories: [
            { name: "Lorem Ipsum Generator", path: "/miscellaneous/lorem-ipsum-generator", icon: "/assets/icons/lorem-ipsum-generator-icon.png" },
            { name: "UUID Generator", path: "/miscellaneous/uuid-generator", icon: "/assets/icons/uuid-generator-icon.png" },
            { name: "Base64 Encoder/Decoder", path: "/miscellaneous/base64-encoder-decoder", icon: "/assets/icons/base64-encoder-decoder-icon.png" },
        ],
        icon: "/assets/icons/misc-icon.png",
        path: "/miscellaneous",
    },
];