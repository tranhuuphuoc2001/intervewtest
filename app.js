'use strict';

/** @fileoverview  Entry point of the application */

const log = require('log4js').getLogger('App');
const _ = require('lodash');
const express = require('express');
const nocache = require('nocache');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cmEnum = require('./common/enum');
const configuration = require('./configuration');
require('dotenv').config();

log.info('Starting server');

module.exports = (async () => {
    _setupProcessHandlers();

    const app = express();
    app.use(helmet());
    app.use(nocache());
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors(configuration.get('server.cors')));
    app.set('trust proxy', true);
    app.get('/', (req, res) => res.redirect(configuration.get('server.urls.defaults')));
    const routers = configuration.get('server.urls.routers');
    _setupMiddlewareRouters(app, routers, cmEnum.RouterType.NO_CSRF);
    _setupApiHandler(app);
    return { app };
})();

function _setupProcessHandlers() {
    process.on('exit', () => log.fatal('=== Fatal Error: Application Closed ==='));

    process.on('uncaughtException', (err) => log.error('Unhandled Exception at', err));
    process.on('unhandledRejection', (reason) => {
        if (!(reason instanceof Error) || reason.name !== 'FeatureNotEnabled') {
            log.error('Unhandled Rejection at', reason);
        }
    });
}

function _setupMiddlewareRouters(app, routes, routeType) {
    if (routes) {
        routes
            .filter((route) => (route.file && route.path))
            .forEach((route) => {
                const routeModule = require(route.file);
                app.use(route.path, routeModule.setup(routeType));
                log.info(`${route.file} will be public access via ${route.path}`);
                app.use(route.path, _genericSuccessMiddleware);
            });
    }
}

function _setupApiHandler(app) {
    app.use(_genericErrorMiddleware);
}

function _genericSuccessMiddleware(req, res, next) {
    if (req.status === undefined && req.answer === undefined) {
        res.sendStatus(404);
    } else {
        res.status(_.get(req, 'status', 200)).json(req.answer);
    }
}

function _genericErrorMiddleware(err, req, res, next) {
    let httpStatus = _.get(err, 'status', 200);
    return res.status(httpStatus).json(req.answer);
}

