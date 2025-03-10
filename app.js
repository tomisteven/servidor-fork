const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const cookieParser = require("cookie-parser");

const sistema = require("./Routes/sistema.route");
const paciente = require("./Routes/Paciente.router");
const doctores = require("./Routes/doctor.router");
const secretaria = require("./Routes/Secretaria.router");

const app = express();
const dotenv = require("dotenv");

dotenv.config();

// Settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(express.static(__dirname + "/uploads"));

// Routes
app.use("/api", paciente);
app.use("/api", doctores);
app.use("/api", secretaria);
app.use("/auth", sistema);

module.exports = app;
