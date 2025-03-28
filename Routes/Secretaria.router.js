const Router = require("express");
const { asureAuth } = require("../middlewares/authenticated");

const multipart = require("connect-multiparty");

const md_upload = multipart({ uploadDir: "./uploads" });

const {
  getSecretarias,
  crearSecretaria,
  verSecretaria,
  eliminarSecretaria,
  subirDocumentoAPaciente,
  obtenerUrlDescarga,
  updateSecretaria,
} = require("../controllers/Secretaria.controller.js");

const router = Router();

router.patch("/secretaria/:id", asureAuth, updateSecretaria);
router.get("/secretarias", asureAuth, getSecretarias);
router.post("/secretaria", asureAuth, crearSecretaria);
router.get("/secretaria/:id", asureAuth, verSecretaria);
router.delete("/secretaria/:id", asureAuth, eliminarSecretaria);
router.post(
  "/secretaria/:id/subir",
  [asureAuth, md_upload],
  subirDocumentoAPaciente
);

router.get("/descargar/:nombreArchivo", asureAuth, obtenerUrlDescarga);

module.exports = router;
