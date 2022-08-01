const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const mongoose = require("mongoose");
var bodyparser = require("body-parser");
const Route = require("./Routes/index");
require("dotenv").config();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(bodyparser.json());
app.use(cors());
app.use("/",Route);

const PORT = process.env.PORT;


io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  console.log("emit me ran");

  socket.on("disconnect", () => {
    socket.broadcast.emit("callended");
  });

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    console.log("calluser ran");
    io.to(userToCall).emit("calluser", { signal: signalData, from, name });
    console.log("calluser emitted");
  });

  socket.on("answercall", (data) => {
    io.to(data.to).emit("callaccepted", { signal: data.signal });
    console.log("callaccepted emitted");
  });
});

mongoose
  .connect(process.env.DATABASE)
  .then(console.log("database connected"))
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
