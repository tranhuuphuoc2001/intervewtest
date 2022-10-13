'use strict';

/**
 * @fileoverview User settings.
 * For full list of settings, refer to configuration.js.
 * Unit for time is ALWAYS in seconds */

module.exports = {
    timezone: '+08:00',
    tempFolder: 'tmp',
    server: {
        http: {
            port: 85,
        },
        https: {
            port: 443,
            ssl: {
                cert: '', 
                key: '', 
                intermediates: [], 
            },
        },
        cors: {
            origin: [],
        },
        urls: {
            default: '/',
        },
    },    
    features: {
    },
};
