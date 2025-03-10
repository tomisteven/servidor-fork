const { id } = require("@hapi/joi/lib/base");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PacienteSchema = new Schema({
  nombre: { type: String, required: true },
  usuario: String,
  edad: String,
  email: String,
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    unique: true,
  },
  documentos: [
    {
      urlArchivo: String,
      idArchivo: String,
      fechaSubida: { type: Date, default: Date.now },
      nombreArchivo: String,
      originalFilename: String,
    },
  ],

  obraSocial: String,
  telefono: String,
  email: String,
  direccion: String,
  localidad: String,
  provincia: String,
  pais: String,
  estado: String,
  motivoBaja: String,
  observaciones: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  rol: { type: String, default: "Paciente" },
});

module.exports = mongoose.model("Paciente", PacienteSchema);
