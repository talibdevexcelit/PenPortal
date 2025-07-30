import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Test response from Express on Vercel');
});

export default app;