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
  const { participantName, college, eventName } = req.body;
  try {
    const imgBuf = await generateCertificate(["name", "college", "event"], {
      name: participantName,
      college,
      event: eventName,
    });
    res.status(200).send(imgBuf);
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
    await db.certificate.create({
      data: {
        format: data,
        fields: fields.split(","),
      },
    });
    res.status(200).send("Format created successfully");
  } catch (error) {
    res.status(500).send("Error generating certificate");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
