/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                c_Lime: "hsl(61, 70%, 52%)",
                c_Red: "hsl(4, 69%, 50%)",
                c_Slate_100: "hsl(202, 86%, 94%)",
                c_Slate_300: "hsl(203, 41%, 72%)",
                c_Slate_500: "hsl(200, 26%, 54%)",
                c_Slate_700: "hsl(200, 24%, 40%)",
                c_Slate_900: "hsl(202, 55%, 16%)",
            },
            fontFamily: {
                plus_jakarta: ["Plus Jakarta Sans", "sans-serif"]
            }
        },
    },
    plugins: [],
}

