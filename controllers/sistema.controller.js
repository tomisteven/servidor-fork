const Paciente = require("../models/Paciente");
const Secretaria = require("../models/Secretaria");
const Doctor = require("../models/Doctor");



const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validEmail = email.includes("@");
    if (!validEmail) {
      return res.status(400).json({ message: "Email invalido", ok: false });
    }

    const secretaria = await Secretaria.findOne({ email });

    if (secretaria && secretaria.password === password) {
      return res.json({
        message: "Secretaria logueada",
        usuario: secretaria,
        ok: true,
        rol: "secretaria",
      });
    } else {
      const doctor = await Doctor.findOne({ email });
      if (doctor && doctor.password === password) {
        return res.json({
          message: "Doctor logueado",
          usuario: doctor,
          ok: true,
          rol: "doctor",
        });
      } else {
        const paciente = await Paciente.findOne({ email });
        if (paciente && paciente.password === password) {
          return res.json({
            message: "Paciente logueado",
            usuario: paciente,
            ok: true,
            rol: "paciente",
          });
        } else {
          return res.status(400).json({ message: "Usuario no encontrado" });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  login,
};
