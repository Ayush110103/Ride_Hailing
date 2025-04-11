const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway is running' });
});

app.listen(3000, () => {
  console.log('API Gateway running on port 3000');
});