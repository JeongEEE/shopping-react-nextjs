/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
    ignoreBuildErrors: true,
  },
	images: {
		unoptimized: true
	},
	compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
}

module.exports = nextConfig
