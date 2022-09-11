/**
 * Bitcore duplicate workaround
 */
Object.defineProperty(global, '_bitcore', { get() { return undefined }, set() { } })

import app from './app';
import config from './config';

const PORT = process.env.PORT || config.port;
const server = app.listen(PORT, () => {});

module.exports = server;
