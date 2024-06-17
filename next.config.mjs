/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { VERCEL_URL: process.env.VERCEL_URL },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,DELETE,OPTION,PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Authorization, X-API-KEY, Origin, Access-Control-Allow-Request-Method, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Token",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
