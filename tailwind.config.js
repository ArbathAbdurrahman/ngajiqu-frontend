const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}", // Keep this if you have pages dir
        "./components/**/*.{js,ts,jsx,tsx,mdx}", // Keep this if you have components dir
    ],
    theme: {
        extend: {

        },
    },
    plugins: [],
    important: true, // Add this to override Material Tailwind styles
});