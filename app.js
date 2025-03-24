const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const sistema = require("./Routes/sistema.route");
const paciente = require("./Routes/Paciente.router");
const doctores = require("./Routes/doctor.router");
const secretaria = require("./Routes/Secretaria.router");

const app = express();
const dotenv = require("dotenv");
const cron = require("node-cron");

dotenv.config();

// Settings
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use(express.static(__dirname + "/uploads"));

// Cron Jobs
cron.schedule("0 */2 * * *", async () => {
  try {
    const res = await fetch(
      "https://exuberant-joelle-digitalcode-937bee37.koyeb.app/api/pacientes",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: process.env.token,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Cron Job executed");
  } catch (error) {
    console.error("Error in Cron Job:", error);
  }
});

// Routes
app.use("/api", paciente);
app.use("/api", doctores);
app.use("/api", secretaria);
app.use("/auth", sistema);

module.exports = app;
