const Secretaria = require("../models/Secretaria");
const Paciente = require("../models/Paciente");
const {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");

const getSecretarias = async (req, res) => {
  try {
    const secretarias = await Secretaria.find();
    res.json(secretarias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearSecretaria = async (req, res) => {
  try {
    const { email } = req.body;
    const secretariaExistente = await Secretaria.findOne({ email });
    if (secretariaExistente) {
      return res
        .status(400)
        .json({ message: "Ya existe una secretaria con ese email" });
    }
    const secretaria = new Secretaria(req.body);
    await secretaria.save();
    res.json({ message: "Secretaria creada", secretaria });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verSecretaria = async (req, res) => {
  try {
    const secretaria = await Secretaria.findById(req.params.id);
    res.json(secretaria);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarSecretaria = async (req, res) => {
  try {
    await Secretaria.findByIdAndDelete(req.params.id);
    res.json({ message: "Secretaria eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const miRegion = process.env.AWS_REGION;
let s3 = new S3Client({
  region: miRegion,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const subirDocumentoAPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreArchivo } = req.body;
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    if (!req.files || !req.files.dicom) {
      return res
        .status(400)
        .json({ message: "No se ha subido ningún archivo" });
    }

    const file = req.files.dicom; // Acceder correctamente al archivo
    const bucket = "dicom-medical";
    const originalFilename = file.originalFilename
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "-");

    const urlArchivo = `https://${bucket}.s3.${miRegion}.amazonaws.com/${originalFilename}`;

    // Leer el archivo desde la ruta temporal
    const fileBuffer = fs.readFileSync(file.path);

    const params = {
      Bucket: bucket,
      Key: originalFilename, // Usamos el nombre limpio
      Body: fileBuffer,
      ContentType: file.type || "application/octet-stream",
      ACL: "public-read" // 🔹 ESTO HACE QUE EL ARCHIVO SEA PÚBLICO AUTOMÁTICAMENTE
    };


    try {
      const subida = await s3.send(new PutObjectCommand(params));

      // Agregar documento al paciente
      paciente.documentos.push({
        urlArchivo,
        idArchivo: subida.$metadata.requestId,
        nombreArchivo,
        originalFilename,
      });

      await paciente.save(); // Guardar en la base de datos

      // Eliminar el archivo temporal
      fs.unlinkSync(file.path);

      res.json({
        message: "Documento subido con éxito",
        url: urlArchivo,
        ok: true,
        subida,
      });
    } catch (error) {
      console.error("Error al subir a S3:", error);
      res.status(500).json({
        message: "Error al subir archivo a S3",
        error: error.message,
        ok: false,
      });
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

const obtenerUrlDescarga = async (req, res) => {
  try {
    const { nombreArchivo } = req.params; // El nombre del archivo en el bucket
    const bucket = "dicom-medical";

    const params = {
      Bucket: bucket,
      Key: nombreArchivo,
    };

    // Generar la URL firmada
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.json({ url });
  } catch (error) {
    console.error("Error al generar URL de descarga:", error);
    res.status(500).json({ message: "Error al obtener URL de descarga" });
  }
};

module.exports = {
  getSecretarias,
  crearSecretaria,
  verSecretaria,
  eliminarSecretaria,
  subirDocumentoAPaciente,
  obtenerUrlDescarga,
};
