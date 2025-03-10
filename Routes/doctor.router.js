const Router = require("express");
const { asureAuth } = require("../middlewares/authenticated.js");

const {
  getDoctores,
  crearDoctor,
  verDoctor,
  eliminarDoctor,
} = require("../controllers/doctor.controller.js");

const app = Router();

app.get("/doctores", asureAuth, getDoctores);
app.post("/doctor", asureAuth, crearDoctor);
app.get("/doctor/:id", asureAuth, verDoctor);
app.delete("/doctor/:id", asureAuth, eliminarDoctor);

module.exports = app;
