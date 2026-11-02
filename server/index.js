import express from 'express';

const app = express();
const port = process.env.PORT || 3001;

// A simple check that the server is running (not the database API).
app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log('Savora server listening on port ' + port);
});
