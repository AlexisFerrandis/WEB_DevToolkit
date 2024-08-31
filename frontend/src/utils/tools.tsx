export interface ToolSubcategory {
    name: string;
    path: string;
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
            { name: "Color Palette Generator", path: "/style/color-palette-generator" },
            { name: "Gradient Generator", path: "/style/gradient-generator" },
            { name: "Pixel to REM Converter", path: "/style/pixel-to-rem-converter" },
            { name: "CSS Minifier", path: "/style/css-minifier" },
        ],
        icon: "/assets/icons/style-icon.png",
        path: "/style",
    },
    {
        name: "Script",
        subcategories: [
            { name: "JavaScript Minifier", path: "/script/javascript-minifier" },
            { name: "JavaScript Formatter", path: "/script/javascript-formatter" },
            { name: "ES6 to ES5 Converter", path: "/script/es6-to-es5-converter" },
            { name: "Regex Generator", path: "/script/regex-generator" },
        ],
        icon: "/assets/icons/script-icon.png",
        path: "/script",
    },
    {
        name: "Images",
        subcategories: [
            { name: "Image Compressor", path: "/images/image-compressor" },
            { name: "Sprite Generator", path: "/images/sprite-generator" },
            { name: "Image Format Converter", path: "/images/image-format-converter" },
        ],
        icon: "/assets/icons/images-icon.png",
        path: "/images",
    },
    {
        name: "API Tools",
        subcategories: [
            { name: "API Tester", path: "/api-tools/api-tester" },
            { name: "Request Generator", path: "/api-tools/request-generator" },
        ],
        icon: "/assets/icons/api-tools-icon.png",
        path: "/api-tools",
    },
    {
        name: "SEO",
        subcategories: [
            { name: "Meta Tag Checker", path: "/seo/meta-tag-checker" },
            { name: "Link Preview", path: "/seo/link-preview" },
        ],
        icon: "/assets/icons/seo-icon.png",
        path: "/seo",
    },
    {
        name: "Database",
        subcategories: [
            { name: "SQL Query Tester", path: "/database/sql-query-tester" },
            { name: "Query Generator", path: "/database/query-generator" },
        ],
        icon: "/assets/icons/database-icon.png",
        path: "/database",
    },
    {
        name: "Miscellaneous",
        subcategories: [
            { name: "Lorem Ipsum Generator", path: "/miscellaneous/lorem-ipsum-generator" },
            { name: "UUID Generator", path: "/miscellaneous/uuid-generator" },
            { name: "Base64 Encoder/Decoder", path: "/miscellaneous/base64-encoder-decoder" },
        ],
        icon: "/assets/icons/misc-icon.png",
        path: "/miscellaneous",
    },
];