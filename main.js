'use strict';

/** @fileoverview  Binds the application to a network port */

const log = require('log4js').getLogger('App');

// =============== initialize required modules
const _ = require('lodash');
const http = require('http');
const mainApp = require('./app');
const configuration = require('./configuration');

require('dotenv').config();

(async () => {
    try {
        // ============= initialize web server
        const { app } = await mainApp;
        await _createServer(app);
    } catch (err) {
        log.fatal(err);
        process.exit();
    }
})();

async function _createServer(app) {
    const timeout = 24 * 3600 * 1000; // set timeout for waiting response = 1 day

    try {
        let server;
        let protocol;

        protocol = 'http';
        server = http.createServer(app);
        return new Promise((resolve) => {
            const port = process.env.PORT || configuration.get(`server.${protocol}.port`);
            server
                .setTimeout(timeout)
                .listen(port, function listen() {
                    global.serverAddress = `${protocol}://localhost:${port}`;
                    console.log(global.serverAddress);
                    resolve(this);
                });
        });
    } catch (err) {
        throw err;
    }
}
