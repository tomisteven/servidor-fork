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
    const { dni, password } = req.body;
    const pacienteExistente = await Paciente.findOne({ dni });
    if (pacienteExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe un paciente con ese DNI", ok: false });
    }

    const paciente = new Paciente(req.body);
    if (password) {
      paciente.password = password;
    } else {
      paciente.password = dni;
    }
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

async function getDocumentsGroupedByName(req, res) {
  try {
    // Obtener el ID del usuario desde los parámetros de la URL
    const { id } = req.params;

    // Buscar el usuario por ID en la base de datos
    const user = await Paciente.findById(id);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Agrupar documentos por nombre de archivo
    const documents = user.documentos.reduce((acc, documento) => {
      // Verificar si ya existe un grupo para este nombre de archivo
      const existingGroup = acc.find(
        (group) => group.nombreArchivo === documento.nombreArchivo
      );

      if (existingGroup) {
        // Si existe, agregar el documento al grupo
        existingGroup.archivos.push(documento);
      } else {
        // Si no existe, crear un nuevo grupo
        acc.push({
          nombreArchivo: documento.nombreArchivo,
          archivos: [documento],
        });
      }

      return acc;
    }, []);

    // Devolver los documentos agrupados
    return res.json(documents);
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = {
  getPacientes,
  getPaciente,
  createPaciente,
  deletePaciente,
  updatePaciente,
  getDocumentsGroupedByName,
};
