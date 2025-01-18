import express from "express";
import { generateCertificate } from "./utils/generate-cert";
import multer from "multer";
import { db } from "./db";
const app = express();
const upload = multer();

const port = 8080;
app.use(express.json());

app.use(express.static("public"));

app.get("/ping", (_, res) => {
  res.send("pong");
});

app.post("/generate-certificate", async (req, res) => {
  const { cert_id, details } = req.body;
  try {
    const cert = await db.certificate.findUniqueOrThrow({
      where: {
        id: cert_id,
      },
    });
    const imgBuf = await generateCertificate(cert.fields, details, cert.format);
    res.status(200).set("Content-Type", "image/png").send(imgBuf);
  } catch (error) {
    res.status(500).send("Error generating certificate");
  }
});

app.post("/create-format", upload.single("html_file"), async (req, res) => {
  const { format, fields } = req.body;
  try {
    if ((!req.file && !format) || !fields) {
      res.status(400).send("Please provide a file or format");
      return;
    }
    const data = req.file ? req.file.buffer.toString() : format;
    const cert = await db.certificate.create({
      data: {
        format: data,
        fields: fields.split(","),
      },
      select: {
        id: true,
      },
    });
    res
      .status(200)
      .send({ msg: "Format created successfully", cert_id: cert.id });
  } catch (error) {
    res.status(500).send("Error generating certificate");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
