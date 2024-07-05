// Acquiring Express
const express = require("express")
const app = express()

// Using http module to create a server
const http = require("http")
const server = http.createServer(app)

// using path module to tell paths to folders
const path = require("path")
//Static files folder
app.use(express.static(path.join(__dirname, 'public')))

//Package for sending error
const session = require("express-session")
const flash = require("connect-flash")
// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
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

// Acquiring Socket.io package
const socket = require("socket.io")
const io = new socket.Server(server)

io.on("connection", (socket) => {
  socket.on("welcome", (username) => {
    socket.broadcast.emit("message", `Welcome ${username}`)
    socket.join(username)
  })
  socket.on("message", (msg) => {
    io.emit("message", msg)
  })
  socket.on("private", (data) => {
    io.to(data.to).emit("message",data.msg)
  })
})
//Routes
const chatRoute = require("./routes/chatRoute.js")
app.use("/", chatRoute)
const userRoute = require("./routes/userRoute.js")
app.use("/user  ", userRoute)
// Setting Up Templating Engine
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

server.listen(8000, () => console.log('Server Started'))