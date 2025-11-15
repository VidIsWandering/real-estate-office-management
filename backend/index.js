const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Hello from Backend!');
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`); // <-- Sẽ tự động in ra 8080
});

//trigger backend ci
