import express, { Request, Response } from "express";
import { generateCertificate } from "./utils/generate-cert";

const app = express();
const port = 8080;
app.use(express.json());

app.use(express.static("public"));

app.get("/ping", (_, res) => {
  res.send("pong");
});

app.post("/generate-certificate", async (req, res) => {
  const { participantName, college, eventName } = req.body;
  try {
    const imgBuf = await generateCertificate(
      participantName,
      college,
      eventName
    );
    res.status(200).send(imgBuf);
  } catch (error) {
    res.status(500).send("Error generating certificate");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
