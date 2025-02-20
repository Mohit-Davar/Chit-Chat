const express = require("express")
const http = require("http")
const path = require("path")
const { connectToMongoDB } = require("./connection.js")

require('dotenv').config()
const PORT = process.env.PORT 

const session = require("express-session")
const flash = require("connect-flash")

const { JWTMiddleware } = require("./middleware/jwt.js")
const cookieParser = require('cookie-parser')

const userRoute = require("./routes/userRoute.js")
const chatRoute = require("./routes/chatRoute.js")

const socket = require("socket.io")
const { addMessage, updateChat } = require("./controllers/messageController.js")
const fs = require('fs')


// Acquiring Express
const app = express()
// Using http module to create a server
const server = http.createServer(app)
// using path module to tell paths to folders
//Static files folder
app.use(express.static(path.join(__dirname, 'public')))
//Package for sending error
// Set up session middleware
app.use(session({
  secret: process.env.ErrorKey,
  resave: false,
  saveUninitialized: true
}));
// Set up flash middleware
app.use(flash());
// Make flash messages available in templates
app.use((req, res, next) => {
  res.locals.error = req.flash('error');
  next();
});
// input parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
//connecting MongoDB
connectToMongoDB(process.env.MongoDBURL)


// socket.io code
// Acquiring Socket.io package
const io = new socket.Server(server)
io.on("connection", (socket) => {
  const rooms = []

  socket.on("join", (email) => {
    if (!rooms.includes(email)) rooms.push(email)
    socket.join(rooms)
  })

  socket.on("texting", ({ sendTo }) => {
    //Joining Socket to recievers room
    if (!rooms.includes(sendTo)) rooms.push(sendTo)
    socket.join(rooms)
    socket.broadcast.to(sendTo).emit("texting")
  })
  // Handle stop typing event
  socket.on('stop typing', ({ sendTo }) => {
    socket.broadcast.to(sendTo).emit('stop typing');
  });

  socket.on("privateMessage", async ({ sendTo, sentBy, content }) => {
    // sending message to yourself
    socket.emit("ownMessage", content)
    // adding message to db
    const messageId = await addMessage(sentBy, sendTo, content)
    await updateChat(sentBy, sendTo, messageId)
    socket.broadcast.to(sendTo).emit('privateMessage', [content, sentBy]);
  })

  socket.on("privateImage", async ({ data, sendTo, sentBy, fileName }) => {
    if (!rooms.includes(sendTo)) rooms.push(sendTo)
    socket.join(rooms)
    socket.emit("ownImage", data)
    const filePath = path.join(__dirname, 'public/uploads', fileName);

    fs.writeFile(filePath, Buffer.from(data), async (err) => {
      if (err) {
        socket.emit('uploadError', { error: 'Failed to upload image' });
      } else {
        const imageUrl = `/uploads/${fileName}`;
        // adding message to db
        const messageId = await addMessage(sentBy, sendTo, imageUrl, "image")
        await updateChat(sentBy, sendTo, messageId)
      }
    });
    socket.broadcast.to(sendTo).emit('privateImage', [data, sentBy]);
  })

  socket.on("disconnect", () => {
    socket.leave(rooms);
  })
})
//Routes
app.use("/chat", JWTMiddleware, chatRoute)
app.use("/user", userRoute)
// Setting Up Templating Engine
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

server.listen(PORT, () => console.log(`Server Started at ${PORT}`))