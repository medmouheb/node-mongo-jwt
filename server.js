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


let arr = [
  {
    id: 1,
    points: [
      { latitude: 8.8994162, longitude: 35.21065230000001 },
      { latitude: 8.892434, longitude: 35.209614 },
      { latitude: 10.139011, longitude: 35.947381 }
    ]
  },

  {
    id: 2,
    points: [
      { latitude: 10.17034, longitude: 35.965803 },
      { latitude: 10.163459, longitude: 35.965362000000006 },
      { latitude: 8.892434, longitude: 35.209614 }
    ]
  },
]
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
    // `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`
    "mongodb+srv://mohamedmouheb:bLIRw4DXLTDWVDVa@cluster0.kugwfsv.mongodb.net/smartMadinaty?retryWrites=true&w=majority"
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


  let elemnt1 = arr[0]
  let elemnt2 = arr[1]

  let i1 = 0
  let i2 = 0




  let points1 = generatePointsBetween(elemnt1.points[i1], elemnt1.points[i1 + 1], 20,  elemnt1.id)
  let points2 = generatePointsBetween(elemnt2.points[i2], elemnt2.points[i2 + 1],20 ,elemnt2.id)


  let j1 = 0
  let j2 = 0


  // Send array every second
  setInterval(() => {
    socket.emit('updateArray', [points1[j1], points2[j2]]);

    if(j1==19){
      j1=0

      if(i1==elemnt1.points.length-2){
        i1=0
      }else{
        i1=i1+1
      }
    }else{
      j1++
    }

    points1 = generatePointsBetween(elemnt1.points[i1], elemnt1.points[i1 + 1],20, elemnt1.id)


    if(j2==19){
      j2=0
      if(i2==elemnt2.points.length-2){
        i2=0
      }else{
        i2++
      }
    }else{
      j2++
    }

    points2 = generatePointsBetween(elemnt2.points[i2], elemnt2.points[i2 + 1],20, elemnt2.id)


  }, 1000);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
function yourUpdateLogic(arr1) {

  return arr1.map(item => ({
    id: item.id,
    cordinations: [item.cordinations[0] + 0.0001, item.cordinations[1] + 0.0001]
  }));
}


function generatePointsBetween(startPoint, endPoint, numberOfPoints, id) {
  const latDiff = (endPoint.latitude - startPoint.latitude) / (numberOfPoints - 1);
  const lonDiff = (endPoint.longitude - startPoint.longitude) / (numberOfPoints - 1);

  return Array.from({ length: numberOfPoints }, (_, index) => ({
    id,
    cordinations: [
      startPoint.latitude + index * latDiff,
      startPoint.longitude + index * lonDiff
    ]
  }));
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
