/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");

module.exports = withPWA({
	reactStrictMode: true,
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
	},
});

module.exports = {
	generateBuildId: async () => {
		// You can, for example, get the latest git commit hash here
		return "my-build-id";
	},
};
