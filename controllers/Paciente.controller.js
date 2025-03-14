const Paciente = require("../models/Paciente");

const getPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePaciente = async (req, res) => {
  try {
    await Paciente.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Paciente actualizado", ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message, ok: false });
  }
};

const getPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPaciente = async (req, res) => {
  try {
    const { dni } = req.body;
    const pacienteExistente = await Paciente.findOne({ dni });
    if (pacienteExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe un paciente con ese DNI", ok: false });
    }

    const paciente = new Paciente(req.body);
    paciente.password = dni;
    await paciente.save();
    res.json({ message: "Paciente creado", paciente, ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message, ok: false });
  }
};

const deletePaciente = async (req, res) => {
  try {
    await Paciente.findByIdAndDelete(req.params.id);
    res.json({ message: "Paciente eliminado", ok: true });
  } catch (error) {
    res.status(500).json({ message: error.message, ok: false });
  }
};

module.exports = {
  getPacientes,
  getPaciente,
  createPaciente,
  deletePaciente,
  updatePaciente,
};
