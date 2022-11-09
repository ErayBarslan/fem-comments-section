require('dotenv').config()

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.ENV_CLOUD_NAME,
  api_key: process.env.ENV_CLOUD_KEY,
  api_secret: process.env.ENV_CLOUD_SECRET
})

module.exports = { cloudinary }