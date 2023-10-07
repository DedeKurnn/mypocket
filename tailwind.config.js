/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			gridTemplateColumns: {
				sidebar: "300px auto", //for sidebar layout
				"sidebar-collapsed": "64px auto", //for collapsed sidebar layout
			},
			colors: {
				"main-dark": "#0F172A",
				"container-dark": "#111c36",
			},
		},
	},
	plugins: [],
};
