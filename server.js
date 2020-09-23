const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

io.on("connection", (socket) => {
  io.emit("some event", {
    someProperty: "some value",
    otherProperty: "other value",
  }); // trigger event "some event" when user is connected. this will be trigger again on server restart

  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // send message to front
  }); // if user emit any event with name "chat message" this code will be execute

  // username is triggered when user connected and entered his name
  socket.on("username", (username) => {
    // send message to all old user except certain new user emitting socket
    socket.broadcast.emit("user is connected", `${username} is joined to chat`);

    socket.on("disconnect", () => {
      socket.broadcast.emit(
        "user is disconnected",
        `${username} leave from chat`
      );
    }); // if user disconnect this event will be execute
  });
});

const port = process.env.PORT || 3000;
http.listen(port, () => console.log(`server is running on port ${port}`));
