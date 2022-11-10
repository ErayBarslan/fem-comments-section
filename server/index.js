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

const server = https.createServer(app)
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

app.get('/', (req, res) => res.send('Comment Section API'))

app.use(`/api/user`, userRoutes)
app.use(`/api/comments`, commentRoutes)

mongoose.connect(process.env.ENV_MONGO_URI)
  .then(() => {
    server.listen(process.env.ENV_PORT, () => {
      console.log('listening...')
    })
  })
  .catch(error => console.log(error))