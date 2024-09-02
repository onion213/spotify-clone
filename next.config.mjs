/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xyndnmugtocynpobkppx.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
}

export default nextConfig
