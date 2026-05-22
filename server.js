const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let messages = [];

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date().toISOString()
  });
});

app.get("/api/random", (req, res) => {
  res.json({
    number: Math.floor(Math.random() * 1000),
    uuid: crypto.randomUUID()
  });
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/messages", (req, res) => {
  const msg = {
    id: crypto.randomUUID(),
    text: req.body.text || "leer",
    createdAt: new Date().toISOString()
  };

  messages.push(msg);
  res.json(msg);
});

app.delete("/api/messages/:id", (req, res) => {
  messages = messages.filter(m => m.id !== req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server läuft auf ${PORT}`);
});
