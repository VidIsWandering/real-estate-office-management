const express = require('express');
const app = express();
const port = 3001; // Cổng backend

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});