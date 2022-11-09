const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: '/default-avatar.png'
  },
  bio: {
    type: String,
    default: "I’m a mysterious individual."
  },
  upvoted: {
    type: [String],
  },
  downvoted: {
    type: [String]
  }
}, { timestamps: true })

UserSchema.statics.signup = async function (name, password) {
  if (!name || !password) throw new Error('Please fill in both fields.')

  const exists = await this.findOne({ name })
  if (exists) throw new Error('That username is already in use.')

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  const user = await this.create({ name, password: hash })

  return user
}


UserSchema.statics.login = async function (name, password) {
  if (!name || !password) throw new Error('Please fill in both fields.')

  const user = await this.findOne({ name })
  if (!user) throw new Error('Invalid creentials.')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid credentials.')

  return user
}

module.exports = mongoose.model('user', UserSchema)