/** @type {import('next').NextConfig} */

const rewrites = async () => {
  return [
    {
      source: "/user/signup",
      destination: `${process.env.API_URL}/user/signup`,
    },
    {
      source: "/user/login",
      destination: `${process.env.API_URL}/user/login`,
    },
    {
      source: "/user/upload",
      destination: `${process.env.API_URL}/user/upload`,
    },
    {
      source: "/user/:id",
      destination: `${process.env.API_URL}/user/:id`,
    },
    {
      source: "/comments",
      destination: `${process.env.API_URL}/comments`,
    },
    {
      source: "/comments/:id",
      destination: `${process.env.API_URL}/comments/:id`,
    },
    {
      source: "/user/vote/:id",
      destination: `${process.env.API_URL}/user/vote/:id`,
    },
  ]
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  devIndicators: {
    buildActivity: false
  },
  images: {
    domains: ['res.cloudinary.com']
  },
  env: {
    API_URL: process.env.API_URL
  },
  rewrites,
}

module.exports = nextConfig