const jwt = require('jsonwebtoken')
const User = require('../models/user')

const verifyAuth = async (req, res, next) => {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token is missing." })
  }

  const token = authorization.split(' ')[1]

  try {
    const { _id } = jwt.verify(token, process.env.ENV_JWT_SECRET)

    req.user = await User.findOne({ _id })
    next()
  } catch (error) {
    res.status(401).json({ error: "You shall not pass!" })
  }
}

module.exports = { verifyAuth }