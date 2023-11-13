const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

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

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,upload.single('avatar', 1)
    ],
    controller.signup
  );

  app.post("/api/auth/signin",controller.signin);

  app.post("/api/auth/signout", controller.signout);
};
