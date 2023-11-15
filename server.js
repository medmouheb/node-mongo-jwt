const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require('path');
const http = require('http');  
const socketIO = require('socket.io');  
const dbConfig = require("./app/config/db.config");

const app = express();
const server = http.createServer(app);  

const io = socketIO(server);  
const imageDirectory = path.join(__dirname, 'app/uploads');


let arr=[{id:1,cordinations:[10.165621999999999,35.966705000000005] } , {id:2,cordinations:[10.167133,35.967172000000005]}]

app.use(cors());
/* for Angular Client (withCredentials) */
// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:8081"],
//   })
// );

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(
    `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
    // "mongodb+srv://mohamedmouheb:bLIRw4DXLTDWVDVa@cluster0.kugwfsv.mongodb.net/smartMadinaty?retryWrites=true&w=majority"
    ,
   {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
app.get('/api/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(imageDirectory, filename);

  res.sendFile(imagePath);
});
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/lamppost.routes")(app);
require("./app/routes/claim.routes")(app);
require("./app/routes/store.routes")(app);
require("./app/routes/trash.routes")(app);
require("./app/routes/gasStation.routes")(app);
require("./app/routes/post.routes")(app);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {  // Change this line
  console.log(`Server is running on port ${PORT}.`);
});

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send array every second
  setInterval(() => {
    const updatedArray = yourUpdateLogic();  // Implement your logic here
    socket.emit('updateArray', updatedArray);
  }, 1000);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
function yourUpdateLogic() {

  arr= arr.map(item => ({
    id: item.id,
    cordinations: [item.cordinations[0] + 0.0001, item.cordinations[1]+ 0.0001]
  }));
  return arr
}

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "driver"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'driver' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "superAdmin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'superAdmin' to roles collection");
      });
    }
  });
}
