const express = require('express');
const app = require("./app");
const path = require("path");

require('./io');

const publicDir = path.join(__dirname, "../public");
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});
