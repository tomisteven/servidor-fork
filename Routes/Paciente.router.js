const Router = require("express");
const { asureAuth } = require("../middlewares/authenticated");

const {
  getPacientes,
  getPaciente,
  createPaciente,
  deletePaciente,
  updatePaciente,
} = require("../controllers/Paciente.controller.js");

const app = Router();

// Paciente Controller

app.get("/pacientes", asureAuth, getPacientes);
app.get("/paciente/:id", asureAuth, getPaciente);
app.post("/paciente", asureAuth, createPaciente);

app.patch("/paciente/:id", asureAuth, updatePaciente);
app.delete("/paciente/:id", asureAuth, deletePaciente);

module.exports = app;
