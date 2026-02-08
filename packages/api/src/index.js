const { SERVER_PORT, SERVER_HOST } = require('./config/server');
const app = require('./app/index');

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`API server running at http://${SERVER_HOST}:${SERVER_PORT}`);
});
