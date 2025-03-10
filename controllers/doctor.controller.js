const Doctor = require("../models/Doctor");

const getDoctores = async (req, res) => {
  try {
    const doctores = await Doctor.find();
    res.json(doctores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    const doctorExistente = await Doctor.findOne({ email });
    if (doctorExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe un doctor con ese email" });
    }
    const doctor = new Doctor(req.body);
    await doctor.save();
    res.json({ message: "Doctor creado", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctores,
  crearDoctor,
  verDoctor,
  eliminarDoctor,
};
