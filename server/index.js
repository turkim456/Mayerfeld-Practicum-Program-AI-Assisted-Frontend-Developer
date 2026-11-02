import { app } from './app.js';
import { db } from './db.js';

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log('Savora server listening on port ' + port);
});

function shutdown() {
  server.close(() => db.end());
}
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
