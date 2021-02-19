const express = require('express');
const helmet = require('helmet');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

// Set public directory
const publicDir = path.join(__dirname, './public');
app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/html/index.html'));
})

app.listen(PORT, () => console.log(`Listening port ${PORT}`));