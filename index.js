const express = require("express")
const http = require("http")
const path = require("path")
const session = require("express-session")
const flash = require("connect-flash")
const cookieParser = require('cookie-parser')
const { connectToMongoDB } = require("./connection.js")
const socket = require("socket.io")
const { JWTMiddleware } = require("./middleware/jwt.js")
const userRoute = require("./routes/userRoute.js")
const chatRoute = require("./routes/chatRoute.js")




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
// input parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
//connecting MongoDB
connectToMongoDB("mongodb://localhost:27017/Chatting-App")

// Acquiring Socket.io package
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
    io.to(data.to).emit("message", data.msg)
  })
})
//Routes
app.use("/chat", JWTMiddleware, chatRoute)
app.use("/user", userRoute)
// Setting Up Templating Engine
app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

server.listen(8000, () => console.log('Server Started'))