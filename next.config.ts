/** @type {import('next').NextConfig} */

const path = require('path')

const webpack = require('webpack')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {},
  // assetPrefix:  process.env.NODE_ENV === "production" ?'/' :'',
  // serverRuntimeConfig: {
  //   // Will only be available on the server side
  //   mySecret: 'secret',
  //   secondSecret: process.env.SECOND_SECRET, // Pass through env variables
  // },
  // publicRuntimeConfig: {

  // },
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
  webpack: (config, { dev, isServer })=>{
    config.module.rules.push(
      {
        test: /\.(graphql|gql)/,
        exclude: /node_modules/,
        loader: "graphql-tag/loader"
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      }
    )

    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      })
    )

    if (!isServer){
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false
      }
    }

    return config
  },
  trailingSlash: false, // for exportPathMap
  // exportPathMap: process.env.NODE_ENV === 'production'
  // ?async function(defaultPathMap, { dev, dir, outDir, distDir, buildId }){
  //     defaultPathMap['404'] = defaultPathMap['/_error']

  //     return defaultPathMap
  //   // return {
  //   //   '/': { page: '/' },
  //   //   '/about': { page: '/about' },
  //   // }
  // }
  // :null,
}

module.exports = nextConfig