const controller = require("../controllers/trash.controller");
const { authJwt } = require("../middlewares");


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post("/api/trash/create", [authJwt.verifyToken,authJwt.isAdmin ] , controller.createTrash);
  
    app.get("/api/trash/getbyid", [authJwt.verifyToken], controller.getById);

    app.get("/api/trash/pages", [authJwt.verifyToken], controller.getPages);

    app.get("/api/trash/search", [authJwt.verifyToken], controller.search);
  };