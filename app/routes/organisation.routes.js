const controller = require("../controllers/organisation.controller");
const { authJwt } = require("../middlewares");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'app/uploads/'); // Define the directory where uploaded images will be stored
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post("/api/organisation/create", [upload.array('images', 5)] , controller.createOrganisation);

    app.get("/api/organisation/getbyid", controller.getById);
    app.get("/api/organisation/search", controller.search);


  };

