const app = require('./app');
const config = require('./config');

const PORT = process.env.PORT || config.port;
const server = app.listen(PORT, () => {});

module.exports = server;
