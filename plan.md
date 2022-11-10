Stack:
-nextJS
-styled-components
-express
-socket.io (live chat response)
-mongodb
-cloudinary (for profile pic)

Server:
-Basic setup +
-User model +
-Comment model (tied to user) +
-userRoutes (signup, login, edit) +
-commentRoutes (get, post, delete, edit) +
-Controllers +

Client:
-Test API +

Server:
-Socket.io +

Client:
-Socket.io +

Tofix:
-fix comment likes + text grid (desktop) [+]
-prevent repeated SEND click [+]
-name(only letters and numbers) [+]
-like area [+]
-register redirect to page [+]
-delete modal position [+]
-update comments on logout [+]

Todo:
-accessible delete modal [+]
-edit [+]
-likes [+]
-profile page [+]
-edit profile [+]
-reply [+]
-styles [+]
-profile card [+]
-mentions [+]
-max char to post [+]
-no access to profile route if !user [+]
-nav menu [+]
-nav logo [+]
-check errors [send and likecomment , ] [+]
-error modal?
-notifications?





const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const commentRoutes = require('./routes/commentRoutes')

require('dotenv').config()

app.use(express.json({ limit: "2mb" }))
app.use(cors())

const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: '*',
    methos: ['GET', 'POST', 'PATCH', 'DELETE']
  }
})

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on("send_comment", (data) => {
    socket.broadcast.emit("receive_comment", data)
  })
})

server.listen(process.env.ENV_SOCKET_PORT, () => {
  console.log(`listening on port ${process.env.ENV_SOCKET_PORT}...`)
})

app.get('/', (req, res) => res.send('Comment Section API'))

app.use(`/api/user`, userRoutes)
app.use(`/api/comments`, commentRoutes)

mongoose.connect(process.env.ENV_MONGO_URI)
  .then(() => {
    app.listen(process.env.ENV_SERVER_PORT, () => {
      console.log(`listening on port ${process.env.ENV_SERVER_PORT}...`)
    })
  })
  .catch(error => console.log(error))