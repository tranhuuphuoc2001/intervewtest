'use strict';

exports.RouterType = Object.freeze({
    AUTH_BY_TOKEN_ONLY: 'TOKEN', // token-based auth, no csrf
    NO_CSRF: 'API', // token/session auth, no csrf
    WITH_CSRF: 'CSRF', // token/session auth, with csrf
});

/**
 * @param {String} DATE  Date only based on ISO8601
 * @param {String} FILE_SAFE  Used to save as file name (Safe for Windows and Linux)
 * @param {String} ENGINE  Date format that engine reads in
 * @param {String} DISPLAY_TEXT  For display purposes only (i.e. not for processing)
 */
exports.DateFormat = Object.freeze({
    DATEOFPURCHASE: 'YYYY-MM-DDT00:00:00Z',
    DATE: 'YYYY-MM-DD',
    SHORTDATE: 'DD-MM-YYYY',
    FILE_SAFE: 'MMDDYYYY[_]HHmm',
    ENGINE: 'YYYY-MM-DDTHH:mm:ssZ',
    ENGINEMAILSTATUS: 'DD-MM-YYYY HH:mm',
    DISPLAY_TEXT: 'DD MMM YYYY, hh:mm A',
});

exports.Regex = Object.freeze({
    Name: /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
    Phone: /65[0-9]{8}/,
    Email: /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
});



exports.DataResponse = Object.freeze([
    { errorCode: '0', Message: 'Success' },
]);

exports.get_DataResponse = (Code) => {
    return exports.DataResponse.find((x) => x.errorCode === Code);
};
