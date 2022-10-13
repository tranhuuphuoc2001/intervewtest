/*
* Copyright (C) 2020
*
* Unauthorized copying of this file, via any medium is strictly prohibited
* Proprietary and confidential
*/
'use strict';

/**
 * @fileoverview Full list of system settings/configurations.
 * Do not modify @private settings unless you know what you are doing.
 * Unit for time is ALWAYS in seconds */

const _ = require('lodash');
const log4js = require('log4js');
const log = log4js.getLogger('Config');
log.level = 'info';

const DEFAULTS = Object.freeze({
    timezone: '+08:00',
    tempFolder: 'tmp', // folder to store scratch files
    server: {
        name: 'interview',
        isSandbox: true,
        isHttps: _.includes(process.argv, 'https'),
        http: {
            port: 85,
        },
        https: { // https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener
            port: 443,
            ssl: {
                cert: '', // .crt file extension
                key: '', // .key file extension
                intermediates: [], // .crt file extension
            },
        },
        cors: { // https://github.com/expressjs/cors#configuration-options
            credentials: true,
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
            origin: [],
        },
        urls: {
            defaults: '/wellcome', // "/" will be redirected to this path
            static: [ ],
            routers: [ 
                { csrf: false, path: '/data', file: './data/arrayRouter' }, 
                { csrf: false, path: '/user', file: './data/userRouter' }, 
                { csrf: false, path: '/', file: './data/router' },
                
            ],
        },
    },
    log: { // https://github.com/log4js-node/log4js-node/tree/master/docs
        appenders: {
            console: { type: 'console' }, // log to console (windows)
            stdout: { type: 'stdout' }, // log to console (linux)
            singleLogFile: { type: 'file', filename: './log/index.out', maxLogSize: 10000000, backups: 10 }, // log to file, maxsize = 10MB, 10 backups
            dailyLogFile: { type: 'dateFile', filename: './log/index.out', daysToKeep: 30 }, // log to file, 1 day 1 file
            dailyErrorFile: { type: 'dateFile', filename: './log/index.err', daysToKeep: 30 }, // log to file, 1 day 1 file
            errors: { type: 'logLevelFilter', appender: 'dailyErrorFile', level: 'error' },
        },
        categories: {
            default: { appenders: ['console'], level: 'info' },
        },
    },
});

let configuration = DEFAULTS;

let userSettingsFile = global.settings || 'setting.js';
process.argv.forEach((args) => {
    if (args.startsWith('--setting=') || args.startsWith('--settings=')) {
        userSettingsFile = args.split('=')[1];
    }
});
_setConfiguration(require(`./${userSettingsFile}`));

/**
 * Returns system configuration
 * @param {String} [key]  Retrieve configuration value for a property. Dot-notation object key is supported.
 * @param {Object} [defaultValue]  If configuration value does not exists, use this value instead.
 * @returns {Object|String}  Full system configuration list, OR a specific value based on `key`
 */
exports.get = function _getConfiguration(key, defaultValue) {
    const value = _.get(configuration, key, defaultValue);
    if (value === undefined) {
        log.warn(`<Config> Key ${key} does not exist.`);
    }
    return (key) ? value : configuration;
};

/**
 * Set system configuration, inclusive of user-specific settings file. This file is to ensure
 * that the settings/configuration always have default values for the system files to use.
 * @param {Object} userSettings  Subset of configurations
 * @returns {void}
 */
function _setConfiguration(userSettings) {
    configuration = Object.freeze(_.merge({}, DEFAULTS, userSettings));

    // standardise log layout
    _.each(configuration.log.appenders, (appender) => {
        appender.layout = {
            type: 'pattern',
            pattern: '%[[%d] [%p] {%x{lineNo}} %]\n<%c> %m',
            tokens: {
                lineNo: () => new Error().stack.split('\n')[16],
            },
        };
    });
    return this;
};
