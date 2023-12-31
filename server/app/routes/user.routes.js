const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const imgcontroller = require("../controllers/image.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);
  
  app.get(
    "/api/test/userServicer",
    [authJwt.verifyToken],
    controller.userBoardServicer
  );
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoardDriver
  );
  app.get(
    "/api/test/userAdmin",
    [authJwt.verifyToken],
    controller.userBoardAdmin
  );
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  app.get(
    "/api/test/items",
    [authJwt.verifyToken],
    controller.itemBoard
  );

  app.post(
    "/api/test/insertFormData",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.insertFormData
  );

  app.post(
    "/api/test/updateReceived",
    [authJwt.verifyToken],
    controller.updateReceived
  );

  app.get(
    "/api/test/deleteData",
    [authJwt.verifyToken],
    controller.deleteData,
  );

  app.post(
    "/api/test/changeStatus",
    [authJwt.verifyToken],
    controller.changeStatus
  );
  app.post(
    "/api/test/uploadImage",
    [authJwt.verifyToken],
    imgcontroller.uploadImage
  );
  app.get(
    "/api/test/getImage",
    [authJwt.verifyToken],
    imgcontroller.getImage
  )
};
