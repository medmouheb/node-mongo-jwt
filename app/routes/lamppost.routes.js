const controller = require("../controllers/lamppost.controller");
const { authJwt,upload } = require("../middlewares");


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post("/api/lamppost/create", [authJwt.verifyToken,authJwt.isAdmin ] , controller.createLamppost);

    

  
    app.get("/api/lamppost/getbyid", [authJwt.verifyToken], controller.getById);

    app.get("/api/lamppost/pages", [authJwt.verifyToken], controller.getPages);

    app.get("/api/lamppost/search", [authJwt.verifyToken], controller.search);




  
    // app.get(
    //   "/api/test/mod",
    //   [authJwt.verifyToken, authJwt.isModerator],
    //   controller.moderatorBoard
    // );
  
    // app.get(
    //   "/api/test/admin",
    //   [authJwt.verifyToken, authJwt.isAdmin],
    //   controller.adminBoard
    // );
  };